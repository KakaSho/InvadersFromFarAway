using UnityEngine;
using System.Collections;

public class ennemis : MonoBehaviour 
{
	
/*////////////////////////////////////*/
//Déclaration des variables liées à Mécanim								 
/*////////////////////////////////////*/
	protected Animator avatar;
	
/*////////////////////////////////////*/
//Déclaration des variables liées à NavAgent								 
/*////////////////////////////////////*/
	private NavMeshAgent navAgent;
	public float navDistance = 4f;
	public Transform targetHeros;

/*////////////////////////////////////*/
//Déclaration des variables liées au Tir								 
/*////////////////////////////////////*/
	public Rigidbody bullet; //type de la variable Bullet, associer a un GameObject
	public float bulletDistance = 20f; //variable de reglage de la distance du bullets
	public Transform spawnBullet; //type de la variable SpawnBullet, déternime la position d'un GameObject ( un gun )
	public float bulletTime = 2f; //Temps de tir
	private bool EnnemisIsDeath = false; //variable de test si ennemis est mort
	private bool EnnemisIsFire = false; //variable de test si ennemis est tir
	
	private float nextUsage;
	public float delay = 0.3f;//two seconds delay.

/*////////////////////////////////////*/
//Fonction de démarrage							 
/*////////////////////////////////////*/	
	void Start () 
	{
		navAgent = GetComponent<NavMeshAgent>(); //Utilisation du composant NavMeshAgent pour le pathfinding
		avatar = GetComponent<Animator>(); //Utilisation du composant liaison avec Mecanim
		nextUsage = Time.time + delay;
	}

	

/*////////////////////////////////////*/
//Fonction de Update par frame							 
/*////////////////////////////////////*/		
	void Update () 
	{
		if(!navAgent.hasPath)
		{
			if(!navAgent.pathPending)
			{
				avatar.SetBool("FireEnnemis",false);
				EnnemisIsFire = false;
				navAgent.destination = targetHeros.transform.position; //tracker la cible
			}
		}
		else
		{
			if(navDistance < navAgent.remainingDistance)
			{
				avatar.SetFloat("SpeedEnnemis",1);
				avatar.SetBool("FireEnnemis",false);
				EnnemisIsFire = false;
				navAgent.destination = targetHeros.transform.position; //tracker la cible
			}
			else if(navAgent.remainingDistance < navDistance)
			{
				avatar.SetFloat("SpeedEnnemis",0); 
				EnnemisIsFire = true;
				navAgent.destination = targetHeros.transform.position; //tracker la cible
			}
		}
		
		
		if(EnnemisIsDeath == true)
			{
				avatar.SetBool("FireEnnemis",false);
				Destroy(gameObject, 0.7f);
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

	
	
/*////////////////////////////////////*/
//Fonction de Tir								 
/*////////////////////////////////////*/		
	void doShootByEnnemis()
	{
			Rigidbody shotEnnemis = Instantiate(bullet, spawnBullet.transform.position, Quaternion.identity) as Rigidbody; //Création d'instance des bullets pour le tir
		    shotEnnemis.velocity = transform.TransformDirection(new Vector3 (0 , 0, bulletDistance)); // Tirer une Bullet
			EnnemisIsFire = false;
	}
	
/*////////////////////////////////////*/
//Fonction de la Mort							 
/*////////////////////////////////////*/
	void OnCollisionEnter(Collision collision)
	{
		avatar.SetFloat("SpeedEnnemis",0);
		avatar.SetBool("FireEnnemis",false);
		avatar.SetBool("DeathEnnemis",true);
		navAgent.destination = Vector3.zero; // arreter le mouvement de l'ennemis
		EnnemisIsDeath = true;
		EnnemisIsFire = false;
	}


	
}
