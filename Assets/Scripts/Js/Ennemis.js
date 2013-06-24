
public var navDistance : float = 2;
public var targetHeros : Transform;

private var navAgent : NavMeshAgent;
private var avatar : Animator;
private var EnnemisIsDeath = false;
private var EnnemisIsFire = false;


public var bullet : Transform; //type de la variable Bullet, associer a un GameObject
public var bulletDistance : float = 800; //variable de reglage de la distance du bullets
public var spawnBullet : Transform; //type de la variable SpawnBullet, déternime la position d'un GameObject ( un gun )
public var bulletTime : float = 2; //Temps de tir

var nextUsage;
var delay=0.3;//two seconds delay.



function Start () 
{
	navAgent = GetComponent(NavMeshAgent);
	avatar = GetComponent.<Animator>();
	
	nextUsage = Time.time + delay;
}

function Update () 
{
	if(!navAgent.hasPath)
	{
		if(!navAgent.pathPending)
		{
			avatar.SetBool("FireEnnemis",false);
			EnnemisIsFire = false;
			navAgent.destination = targetHeros.transform.position;
		}
	}
	else
	{
		if(navDistance < navAgent.remainingDistance)
		{
			avatar.SetFloat("SpeedEnnemis",1);
			avatar.SetBool("FireEnnemis",false);
			EnnemisIsFire = false;
			navAgent.destination = targetHeros.transform.position;
		}
		else if(navAgent.remainingDistance < navDistance)
		{

			avatar.SetFloat("SpeedEnnemis",0);
			EnnemisIsFire = true;
			navAgent.destination = targetHeros.transform.position;
		}
	}
		
	if(EnnemisIsDeath == true)
		{
			avatar.SetBool("FireEnnemis",false);
			Destroy(gameObject, 0.7);
		}
	
	if(EnnemisIsFire == true)
			{
				if (Time.time > nextUsage)
  				{
    				avatar.SetBool("FireEnnemis",true);
    				nextUsage = Time.time + delay;
					doShootByEnnemis();
				}
			}
}



function doShootByEnnemis()
	{
			var shot =Instantiate(bullet, spawnBullet.transform.position, Quaternion.identity);
			shot.rigidbody.AddForce(transform.forward * bulletDistance);
			EnnemisIsFire = false;
	}

function OnCollisionEnter(collision : Collision )
	{
		avatar.SetFloat("SpeedEnnemis",0);
		avatar.SetBool("FireEnnemis",false);
		avatar.SetBool("DeathEnnemis",true);
		navAgent.destination = Vector3.zero;
		EnnemisIsDeath = true;
		EnnemisIsFire = false;
	}
	
