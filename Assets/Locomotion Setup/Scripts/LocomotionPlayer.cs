 /// <summary>
/// 
/// </summary>

using UnityEngine;
using System;
using System.Collections;
  
[RequireComponent(typeof(Animator))]  


public class LocomotionPlayer : MonoBehaviour 
{
	
/*////////////////////////////////////*/
//Déclaration des états d'animations 								 
/*////////////////////////////////////*/
	public bool Jump = false;
	public bool Dodge = false;
	public bool Fire1 = false;
	public bool Death = false;
	public bool Hit = false;
	
/*////////////////////////////////////*/
//Déclaration des variables liées à Mécanim								 
/*////////////////////////////////////*/
    private Locomotion locomotion = null;
	protected Animator animator;
	
/*////////////////////////////////////*/
//Déclaration des variables liées au controle de Mécanim							 
/*////////////////////////////////////*/	
    private float speed = 0;
    private float direction = 0;
	

/*////////////////////////////////////*/
//Fonction de démarrage							 
/*////////////////////////////////////*/	
	void Start () 
	{
        animator = GetComponent<Animator>();
        locomotion = new Locomotion(animator);
	}
    

/*////////////////////////////////////*/
//Fonction de Update par frame							 
/*////////////////////////////////////*/	
	void Update () 
	{
		
		//Controle du personnage Mecanim
        if (animator && Camera.main)
		{
            JoystickToEvents.Do(transform,Camera.main.transform, ref speed, ref direction);
            locomotion.Do(speed * 6, direction * 180);
		}
		
		
		//Changement d'état lorsque le joueur appuie sur les boutons
		if (Input.GetButtonDown("Jump"))
		{
			animator.SetBool("Jump", true);
		}else
		{
			animator.SetBool("Jump", false);
		}
		if (Input.GetButtonDown("Dodge"))
		{
			animator.SetBool("Dodge", true);
		}else
		{
			animator.SetBool("Dodge", false);
		}
		
		if (Input.GetButtonDown("Fire1"))
		{
			animator.SetBool("Fire", true);
		}else
		{
			animator.SetBool("Fire", false);
		}
	
	}

/*////////////////////////////////////*/
//Fonction de la Mort							 
/*////////////////////////////////////*/	
	void OnTriggerEnter(Collider collid)
		{
			if(collid.gameObject.tag == "DeathTrigger")
			{
				
				animator.SetBool("Death", true);
			
			}else
			{
				animator.SetBool("Death", false);

			}
	
		}
	void OnTriggerExit(Collider collid)
		{
				animator.SetBool("Death", false);
		}
	
	
	
/*////////////////////////////////////*/
//Fonction des Dommages							 
/*////////////////////////////////////*/		
	void OnControllerColliderHit(ControllerColliderHit collision)
	{
		if(collision.gameObject.tag == "Player")
		{
			animator.SetBool("Hit", true);
		}
	}
	
	
}

