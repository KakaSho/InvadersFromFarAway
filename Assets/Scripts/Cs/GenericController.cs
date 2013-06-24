using UnityEngine;
using System.Collections;

public class GenericController : MonoBehaviour 
{
	
	protected Animator avatar;
	
	public float DirectionDampTime = 0.25f;
	
	
	void Start() 
	{
		avatar = GetComponent<Animator>();
	}
	
	void Update()
	{
		float h = Input.GetAxis("Horizontal");
		float v = Input.GetAxis("Vertical");
		
		
		avatar.SetFloat("Speed", h*h+v*v);
		avatar.SetFloat("Direction", Mathf.Atan2(h,v) * 180.0f / 3.14159f);
			
		Rigidbody rigidbody = GetComponent<Rigidbody>();
		
		if(rigidbody)
		{
			Vector3 speed = rigidbody.velocity;
			speed.x = 4*h;
			speed.z = 4*v;
			rigidbody.velocity = speed;
		}
		
		
	}
	
	
	
}
