using UnityEngine;
using System.Collections;

public class shooting : MonoBehaviour 
{

/*////////////////////////////////////*/
//Déclaration des variables liées au Tir								 
/*////////////////////////////////////*/
	public Rigidbody bullet; // type de la variable Bullet avec sa physique, associer a un GameObject
	public int bulletDistance = 20; //variable : reglage de la distance des bullets
	public Transform spawnBullet; // type de la variable SpawnBullet, déternime la position d'un GameObject ( un gun )
	public float bulletTime = 1f; // Temps de tir
	private bool shotReady = false; // Test si le Tir est vrai

/*////////////////////////////////////*/
//Fonction de Tir								 
/*////////////////////////////////////*/	
	
	void doShoot ()
	{
		shotReady = true; 
		if(shotReady == true)// Test si le Tir est absolument Vrai
		{
			Rigidbody shot = Instantiate(bullet, spawnBullet.transform.position, Quaternion.identity) as Rigidbody; //Création d'instance des bullets pour le tir
		    shot.velocity = transform.TransformDirection(new Vector3 (0 , 0, bulletDistance)); // Tirer une Bullet
			shotReady = false; //Arret du Tir
			
		}	
	}
	
					
/*////////////////////////////////////*/
//Fonction de Update par frame							 
/*////////////////////////////////////*/	
	
void Update ()
{
	if(Input.GetButtonDown("Fire1"))// Condition lorsque le joueur appuie sur le bouton de tir
	{
		doShoot (); // exercuter la fonction de Tir
	}
		
}
	
	
}
