using UnityEngine;
using System.Collections;

public class DeathAim : MonoBehaviour 
{
	
	private Animator animator;

	
	void Start () 
	{
        animator = GetComponent<Animator>();
	}
	
	void OnTriggerEnter(Collider collid)
		{
			if(collid.gameObject.name == "DeathTrigger")
			{
				animator.SetBool("Death", true);	
			}
		}
}
