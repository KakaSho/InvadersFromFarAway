using UnityEngine;
using System.Collections;

public class TP_Motor : MonoBehaviour 
{
	
	public static TP_Motor Instance;
	
	public float ForwardSpeed = 10f;
	public float BackwardSpeed = 2f;
	public float StrafingSpeed = 5f;
	public float SlideSpeed = 10f;
	public float JumpSpeed = 5f;
	public float Gravity = 10f;
	
	public float TerminalVelocity = 20f;
	public float SlideThreshold = 0.6f;
	public float MaxControlleableSlideMagnitude = 0.4f;
	private Vector3 slideDirection; 
	
	public Vector3 MoveVector{get ; set;}
	public float VerticalVelocity{get ; set;}
	
	
	
	void Awake() 
	{
		Instance = this;
	}
	
	public void UpdateMotor() 
	{
		SnapAlignCharacterWithCamera();
		ProcessMotion();
	}
	
	//Mouvement du Personnage
	void ProcessMotion()
	{
	
		MoveVector =  transform.TransformDirection(MoveVector);
		
		if(MoveVector.magnitude > 1)
		{
			MoveVector = Vector3.Normalize(MoveVector);
		}
		
		ApplySlide();
		
		MoveVector *= MoveSpeed();
		
		MoveVector = new Vector3(MoveVector.x, VerticalVelocity, MoveVector.z);
		
		ApplyGravity();
		
		TP_Controller.CharacterController.Move(MoveVector * Time.deltaTime);
		
		
	}
	
	// Fonction Implémentation de la gravité
	void ApplyGravity()
	{
		if(MoveVector.y > -TerminalVelocity)
			MoveVector = new Vector3(MoveVector.x, MoveVector.y - Gravity * Time.deltaTime, MoveVector.z);
		
		if(TP_Controller.CharacterController.isGrounded && MoveVector.y < -1)
			MoveVector = new Vector3(MoveVector.x, -1, MoveVector.z);

	}
	
	// Fonction Implémentation des slides
	void ApplySlide()
	{
		
		if(!TP_Controller.CharacterController.isGrounded)
			{
				return;
			}
			
		slideDirection = Vector3.zero;
		
		RaycastHit hitInfo;
		
		if(Physics.Raycast(transform.position + Vector3.up, Vector3.down, out hitInfo))
		{
			if(hitInfo.normal.y < SlideThreshold)
			{
				slideDirection = new Vector3(hitInfo.normal.x, -hitInfo.normal.y, hitInfo.normal.z);	
			}
		}
		
		if(slideDirection.magnitude < MaxControlleableSlideMagnitude)
		{
			MoveVector += slideDirection;
		}
		else
		{
			MoveVector = slideDirection;	
		}
		
			
	}

	// Fonction Implémentation du saut
	public void Jump()
	{
		if (TP_Controller.CharacterController.isGrounded)
		{
			VerticalVelocity = JumpSpeed;
		}
	}
	
	
	//Camera cible le joueur
	void SnapAlignCharacterWithCamera()
	{
		if(MoveVector.x != 0 || MoveVector.z != 0)
		{
			transform.rotation = Quaternion.Euler(transform.eulerAngles.x,
				Camera.mainCamera.transform.eulerAngles.y,
				transform.eulerAngles.z);
		}
	}
	
	float MoveSpeed()
	{
		var moveSpeed = 0f;
		
		switch(TP_Animator.Instance.MoveDirection)
		{
			case TP_Animator.Direction.Stationary:
			moveSpeed = 0f;
			break;
			
			case TP_Animator.Direction.Forward:
			moveSpeed = ForwardSpeed;
			break;
			
			case TP_Animator.Direction.Backward:
			moveSpeed = BackwardSpeed;
			break;
			
			case TP_Animator.Direction.Left:
			moveSpeed = StrafingSpeed;
			break;
			
			case TP_Animator.Direction.Right:
			moveSpeed = StrafingSpeed;
			break;
			
			case TP_Animator.Direction.LeftForward:
			moveSpeed = ForwardSpeed;
			break;
			
			case TP_Animator.Direction.RightForward:
			moveSpeed = ForwardSpeed;
			break;
			
			case TP_Animator.Direction.LeftBackward:
			moveSpeed = BackwardSpeed;
			break;
			
			case TP_Animator.Direction.RightBackward:
			moveSpeed = BackwardSpeed;
			break;
			
			
		}
		
		if(slideDirection.magnitude > 0)
		{
			moveSpeed = SlideSpeed;
		}
		
		return moveSpeed;
		
	}
	
}