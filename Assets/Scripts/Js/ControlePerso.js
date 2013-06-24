
// Attachement au script CharacterController(implément dans unity par defaut)
@script RequireComponent(CharacterController)


/*////////////////////////////////////*/
//Déclaration des variables d'animations									 
/*////////////////////////////////////*/
public var idleAnimation : AnimationClip; //Asigne une animation de repos.
public var walkAnimation : AnimationClip; //Asigne une animation de marche.
public var runAnimation : AnimationClip; //Asigne une animation de courir.
public var jumpPoseAnimation : AnimationClip; //Asigne une animation de saut.
public var shootAnimation : AnimationClip;  //Asigne une animation de tir.
public var deadAnimation : AnimationClip;  //Asigne une animation de mort.
public var activateAnimation : AnimationClip;  //Asigne une animation d'activation.
public var dodgeAnimation : AnimationClip;  //Asigne une animation d'esquive.



/*////////////////////////////////////*/
//Déclaration des variables Vitesse des animations									 
/*////////////////////////////////////*/
public var walkMaxAnimationSpeed : float = 0.75;
public var trotMaxAnimationSpeed : float = 1.0;
public var runMaxAnimationSpeed : float = 1.0;
public var jumpAnimationSpeed : float = 1.15;
public var shootAnimationSpeed : float = 1;
public var deadAnimationSpeed : float = 1;
public var activateAnimationSpeed : float = 1;
public var dodgeAnimationSpeed : float = 1;
public var landAnimationSpeed : float = 1.0;


private var _animation : Animation;



/*////////////////////////////////////*/
//Déclaration des états du personnage									 
/*////////////////////////////////////*/
enum CharacterState {
	Idle = 0,
	Walking = 1,
	Trotting = 2,
	Running = 3,
	Jumping = 4,
	Shooting = 5,
	Death = 6,
	Activation = 7,
	Dodged = 8,
}

public var _characterState : CharacterState;


/*////////////////////////////////////*/
//Déclaration des variables liées aux mouvements								 
/*////////////////////////////////////*/
private var moveDirection = Vector3.zero;// mouvement en cours X et Z
public var gravity = 20.0; // la gravité pour le personnage
private var verticalSpeed = 0.0; // vitesse du mouvement verticale en cours 
private var moveSpeed = 0.0; // vitesse du mouvement en cours X et Z
public var speedSmoothing = 10.0;
public var rotateSpeed = 500.0;
private var movingBack = false;// mouvement arriere (bloque la camera pour qu'il ne fasse pas de 180 degres)
private var isMoving = false;// désactive les mouvement lorsque utilisateur n'appuie aucun bouton
private var collisionFlags : CollisionFlags; // la derniere collision revient au character controller
private var inAirVelocity = Vector3.zero;
private var lastGroundedTime = 0.0;
private var isControllable = true;
private var lockCameraTimer = 0.0; // The camera doesnt start following the target immediately but waits for a split second to avoid too much waving around.



/*////////////////////////////////////*/
//Déclaration des variables liées à la marche								 
/*////////////////////////////////////*/
private var walkTimeStart = 0.0;
public var walkSpeed = 2.0; // vitesse de la marche
public var trotSpeed = 4.0; // after trotAfterSeconds of walking we trot with trotSpeed
public var trotAfterSeconds = 3.0; // The gravity in controlled descent mode




/*////////////////////////////////////*/
//Déclaration des variables liées à la course								 
/*////////////////////////////////////*/
public var runSpeed = 6.0; // vitesse de la course


/*////////////////////////////////////*/
//Déclaration des variables liées au saut								 
/*////////////////////////////////////*/
public var jumpHeight = 0.5; // hauteur du saut
public var canJump = true; //activation du saut
private var jumpRepeatTime = 0.05;
private var jumpTimeout = 0.15;
private var groundedTimeout = 0.25;
public var inAirControlAcceleration = 3.0;


// Reinitialisation du saut
private var jumping = false;
private var jumpingReachedApex = false;
private var lastJumpStartHeight = 0.0;
private var lastJumpButtonTime = -10.0;
private var lastJumpTime = -1.0;

/*////////////////////////////////////*/
//Déclaration des variables liées au Tir								 
/*////////////////////////////////////*/
public var bullet : Transform; //type de la variable Bullet, associer a un GameObject
public var bulletSpeed : float = 800; //variable de reglage de la vitesse du bullets
public var spawnBullet : Transform; //type de la variable SpawnBullet, déternime la position d'un GameObject ( un gun )
public var rateOfFire : float = 0.25; 
public var timeDetroyed : float = 1;
public var munitionNormale : int = 20;
	


function Awake ()
{
	moveDirection = transform.TransformDirection(Vector3.forward);
	
	_animation = GetComponent(Animation);
	if(!_animation)
		Debug.Log("The character you would like to control doesn't have animations. Moving her might look weird.");
	
	if(!idleAnimation) {
		_animation = null;
		Debug.Log("No idle animation found. Turning off animations.");
	}
	if(!walkAnimation) {
		_animation = null;
		Debug.Log("No walk animation found. Turning off animations.");
	}
	if(!runAnimation) {
		_animation = null;
		Debug.Log("No run animation found. Turning off animations.");
	}
	if(!jumpPoseAnimation && canJump) {
		_animation = null;
		Debug.Log("No jump animation found and the character has canJump enabled. Turning off animations.");
	}
			
}


function UpdateSmoothedMovementDirection ()
{
	var cameraTransform = Camera.main.transform;
	var grounded = IsGrounded();
	
	// Forward vector relative to the camera along the x-z plane	
	var forward = cameraTransform.TransformDirection(Vector3.forward);
	forward.y = 0;
	forward = forward.normalized;

	// Right vector relative to the camera
	// Always orthogonal to the forward vector
	var right = Vector3(forward.z, 0, -forward.x);

	var v = Input.GetAxisRaw("Vertical");
	var h = Input.GetAxisRaw("Horizontal");

	// Are we moving backwards or looking backwards
	if (v < -0.2)
		movingBack = true;
	else
		movingBack = false;
	
	var wasMoving = isMoving;
	isMoving = Mathf.Abs (h) > 0.1 || Mathf.Abs (v) > 0.1;
		
	// Target direction relative to the camera
	var targetDirection = h * right + v * forward;
	
	// Grounded controls
	if (grounded)
	{
		// Lock camera for short period when transitioning moving & standing still
		lockCameraTimer += Time.deltaTime;
		if (isMoving != wasMoving)
			lockCameraTimer = 0.0;

		// We store speed and direction seperately,
		// so that when the character stands still we still have a valid forward direction
		// moveDirection is always normalized, and we only update it if there is user input.
		if (targetDirection != Vector3.zero)
		{
			// If we are really slow, just snap to the target direction
			if (moveSpeed < walkSpeed * 0.9 && grounded)
			{
				moveDirection = targetDirection.normalized;
			}
			// Otherwise smoothly turn towards it
			else
			{
				moveDirection = Vector3.RotateTowards(moveDirection, targetDirection, rotateSpeed * Mathf.Deg2Rad * Time.deltaTime, 1000);
				
				moveDirection = moveDirection.normalized;
			}
		}
		
		// Smooth the speed based on the current target direction
		var curSmooth = speedSmoothing * Time.deltaTime;
		
		// Choose target speed
		//* We want to support analog input but make sure you cant walk faster diagonally than just forward or sideways
		var targetSpeed = Mathf.Min(targetDirection.magnitude, 1.0);
	
		_characterState = CharacterState.Shooting;
		
		// Pick speed modifier
		if ((Input.GetButton ("Run") && Input.GetButton ("Fire1")) || (Input.GetKey (KeyCode.LeftShift) && Input.GetKeyUp("x")))
		{
			targetSpeed *= 0;
			//targetSpeed *= runSpeed/2;
			_characterState = CharacterState.Shooting;
		}
		else if (Input.GetKey (KeyCode.LeftShift) || Input.GetButton ("Run"))
		{
			targetSpeed *= runSpeed;
			_characterState = CharacterState.Running;
		}
		/*else if (Time.time - trotAfterSeconds > walkTimeStart)
		{
			targetSpeed *= trotSpeed;
			_characterState = CharacterState.Trotting;
		}*/
		else if ((Input.GetButton ("Horizontal") && Input.GetButton ("Fire1")) || (Input.GetButton ("Vertical") && Input.GetKeyUp("x")))
		{
			//targetSpeed *= walkSpeed/2;
			targetSpeed *= 0;
			_characterState = CharacterState.Shooting;
		}
		else if (Input.GetButton ("Fire1") || Input.GetKeyUp("x"))
		{
			targetSpeed *= 0;
			_characterState = CharacterState.Shooting;
		}
		else
		{
			targetSpeed *= walkSpeed;
			_characterState = CharacterState.Walking;
		}
		
	

		
		
		moveSpeed = Mathf.Lerp(moveSpeed, targetSpeed, curSmooth);
		
		// Reset walk time start when we slow down
		if (moveSpeed < walkSpeed * 0.3)
			walkTimeStart = Time.time;
			
	}
	// In air controls
	else
	{
		// Lock camera while in air
		if (jumping)
			lockCameraTimer = 0.0;

		if (isMoving)
			inAirVelocity += targetDirection.normalized * Time.deltaTime * inAirControlAcceleration;
	}
	
	

		
}



/*////////////////////////////////////*/
//Fonction d'activation du Saut							 
/*////////////////////////////////////*/
function ApplyJumping ()
{
	// Prevent jumping too fast after each other
	if (lastJumpTime + jumpRepeatTime > Time.time)
		return;

	if (IsGrounded()) {
		// Jump
		// - Only when pressing the button down
		// - With a timeout so you can press the button slightly before landing		
		if (canJump && Time.time < lastJumpButtonTime + jumpTimeout) {
			verticalSpeed = CalculateJumpVerticalSpeed (jumpHeight);
			SendMessage("DidJump", SendMessageOptions.DontRequireReceiver);
		}
	}
}


/*////////////////////////////////////*/
//Fonction Application de la gravité							 
/*////////////////////////////////////*/
function ApplyGravity ()
{
	if (isControllable)	// don't move player at all if not controllable.
	{
		// Apply gravity
		var jumpButton = Input.GetButton("Jump");
		
		
		// When we reach the apex of the jump we send out a message
		if (jumping && !jumpingReachedApex && verticalSpeed <= 0.0)
		{
			jumpingReachedApex = true;
			SendMessage("DidJumpReachApex", SendMessageOptions.DontRequireReceiver);
		}
	
		if (IsGrounded ())
			verticalSpeed = 0.0;
		else
			verticalSpeed -= gravity * Time.deltaTime;
	}
}


/*////////////////////////////////////*/
//Fonction calcul du saut						 
/*////////////////////////////////////*/
function CalculateJumpVerticalSpeed (targetJumpHeight : float)
{
	// avec jumpheight et gravité, on en déduit la vitesse vers le haut
	return Mathf.Sqrt(2 * targetJumpHeight * gravity);
}


/*////////////////////////////////////*/
//Fonction faire le Saut							 
/*////////////////////////////////////*/
function DidJump ()
{
	jumping = true;
	jumpingReachedApex = false;
	lastJumpTime = Time.time;
	lastJumpStartHeight = transform.position.y;
	lastJumpButtonTime = -10;
	_characterState = CharacterState.Jumping;
}

/*////////////////////////////////////*/
// Application du Tir							 
/*////////////////////////////////////*/
function DoShoot ()
{
	if(munitionNormale > 0 || GetComponent(BonusScript).bonusMunitionIllimite)
	{
			if (Input.GetKeyUp("x") || Input.GetButtonUp("Fire1"))
			{
				
				fireShot();
				//si il n'a pas le bonus de munition illimité, il perd une bille a chaque tir
				if(!GetComponent(BonusScript).bonusMunitionIllimite)
				{
					munitionNormale -= 1;
				}
			}	
	}
}	

function Update() {

	
	
	if (!isControllable)
	{
		Input.ResetInputAxes(); // detruit tous les inputs controlable
	}
	
		


	/*////////////////////////////////////*/
	// Application du saut							 
	/*////////////////////////////////////*/
	if (Input.GetButtonDown ("Jump"))
	{
		lastJumpButtonTime = Time.time;
	}

	/*////////////////////////////////////*/
	//Fonction Application de la UpdateSmoothedMovementDirection							 
	/*////////////////////////////////////*/	
	UpdateSmoothedMovementDirection();
	
	/*////////////////////////////////////*/
	//Application de la gravité							 
	/*////////////////////////////////////*/
	ApplyGravity ();

	/*////////////////////////////////////*/
	//Application de la fonction saut	
	/*////////////////////////////////////*/
	ApplyJumping ();

	/*////////////////////////////////////*/
	//Application de la fonction de tir	
	/*////////////////////////////////////*/	
	DoShoot ();
	
	/*////////////////////////////////////*/
	//Cacul du mouvement
	/*////////////////////////////////////*/	
	var movement = moveDirection * moveSpeed + Vector3 (0, verticalSpeed, 0) + inAirVelocity;
	movement *= Time.deltaTime;
	
	/*////////////////////////////////////*/
	//mouvement du controller
	/*////////////////////////////////////*/		
	var controller : CharacterController = GetComponent(CharacterController);
	collisionFlags = controller.Move(movement);
	
	/*////////////////////////////////////*/
	//Animation list
	//Recherche l'état du personnage									 
	/*////////////////////////////////////*/ 	
	if(_animation) {
		
		if(_characterState == CharacterState.Shooting)
		{
			_animation[shootAnimation.name].speed = shootAnimationSpeed;
			_animation[shootAnimation.name].speed = Mathf.Clamp(controller.velocity.magnitude, 0.0, shootAnimationSpeed);
			_animation.CrossFade(shootAnimation.name);

		}
		if(_characterState == CharacterState.Jumping) 
		{
			if(!jumpingReachedApex) {
				_animation[jumpPoseAnimation.name].speed = jumpAnimationSpeed;
				_animation[jumpPoseAnimation.name].wrapMode = WrapMode.ClampForever;
				_animation.CrossFade(jumpPoseAnimation.name);
			} else {
				_animation[jumpPoseAnimation.name].speed = -landAnimationSpeed;
				_animation[jumpPoseAnimation.name].wrapMode = WrapMode.ClampForever;
				_animation.CrossFade(jumpPoseAnimation.name);				
			}
		}
		if(_characterState == CharacterState.Idle)
		{
				_animation.CrossFade(idleAnimation.name);
		}
		else 
		{
			if(controller.velocity.sqrMagnitude < 0.1) {
				_animation.CrossFade(idleAnimation.name);
			}
			else 
			{
				if(_characterState == CharacterState.Running) {
					_animation[runAnimation.name].speed = Mathf.Clamp(controller.velocity.magnitude, 0.0, runMaxAnimationSpeed);
					_animation.CrossFade(runAnimation.name);	
				}
				else if(_characterState == CharacterState.Trotting) {
					_animation[walkAnimation.name].speed = Mathf.Clamp(controller.velocity.magnitude, 0.0, trotMaxAnimationSpeed);
					_animation.CrossFade(walkAnimation.name);	
				}
				else if(_characterState == CharacterState.Walking) {
					_animation[walkAnimation.name].speed = Mathf.Clamp(controller.velocity.magnitude, 0.0, walkMaxAnimationSpeed);
					_animation.CrossFade(walkAnimation.name);	
				}
				
			}
		}
	}
	
	/*//////////////////////////////////////////////////////////////*/
	//Rotation du personnage en fonction de la direction 						 
	/*//////////////////////////////////////////////////////////////*/	
	if (IsGrounded())
	{
		
		transform.rotation = Quaternion.LookRotation(moveDirection);
			
	}	
	else
	{
		var xzMove = movement;
		xzMove.y = 0;
		if (xzMove.sqrMagnitude > 0.001)
		{
			transform.rotation = Quaternion.LookRotation(xzMove);
		}
	}	
	
	/*////////////////////////////////////*/
	//Retour au sol, apres un saut						 
	/*////////////////////////////////////*/ 	
	if (IsGrounded())
	{
		lastGroundedTime = Time.time;
		inAirVelocity = Vector3.zero;
		if (jumping)
		{
			jumping = false;
			SendMessage("DidLand", SendMessageOptions.DontRequireReceiver);
		}
	}
}

function OnControllerColliderHit (hit : ControllerColliderHit )
{
//	Debug.DrawRay(hit.point, hit.normal);
	if (hit.moveDirection.y > 0.01) 
		return;
}


/*////////////////////////////////////*/
//Fonction de Tir							 
/*////////////////////////////////////*/
function fireShot()
{
	var shot =Instantiate(bullet, spawnBullet.transform.position, Quaternion.identity); 
	shot.rigidbody.AddForce(transform.forward * bulletSpeed);
	_characterState = CharacterState.Shooting;
}


function GetSpeed () {
	return moveSpeed;
}

function IsJumping () {
	return jumping;
}

function IsGrounded () {
	return (collisionFlags & CollisionFlags.CollidedBelow) != 0;
}

function GetDirection () {
	return moveDirection;
}

function IsMovingBackwards () {
	return movingBack;
}

function GetLockCameraTimer () 
{
	return lockCameraTimer;
}

function IsMoving ()  : boolean
{
	return Mathf.Abs(Input.GetAxisRaw("Vertical")) + Mathf.Abs(Input.GetAxisRaw("Horizontal")) > 0.5;
}

function HasJumpReachedApex ()
{
	return jumpingReachedApex;
}

function IsGroundedWithTimeout ()
{
	return lastGroundedTime + groundedTimeout > Time.time;
}

function Reset ()
{
	gameObject.tag = "Player";
}

