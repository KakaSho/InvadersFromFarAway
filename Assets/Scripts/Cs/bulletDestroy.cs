using UnityEngine;
using System.Collections;

public class bulletDestroy : MonoBehaviour 
{

	
	public float timeDestuctionObject = 5f; // variable du temps de destruction.


	void Awake()
	{
		Destroy(gameObject, timeDestuctionObject); // détruire un objet en fonction du temps de destruction.
	}
	
	
	
}
