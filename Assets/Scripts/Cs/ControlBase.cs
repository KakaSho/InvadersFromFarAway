using UnityEngine;
using System.Collections;

public class ControlBase : MonoBehaviour 
{
	
	public float speed = 3.0f;
	public float jumpSpeed = 500.0f;
	public bool grounded = false;

	// Use this for initialization
	void Start () 
	{
	
	}
	
	// Update is called once per frame
	void Update () 
	{
		Vector3 x = Input.GetAxis("Horizontal") * transform.right * Time.deltaTime * speed;
		Vector3 z = Input.GetAxis("Vertical") * transform.forward * Time.deltaTime * speed;
		
		transform.Translate(x+z);
		transform.rotation = Quaternion.LookRotation(Vector3.forward,Vector3.up);
		
		if(Input.GetButtonDown("Jump"))
		{
			Jump();
		}
	}
	
	void Jump()
		{
			
			if(grounded ==true)
			{
				rigidbody.AddForce(Vector3.up * jumpSpeed);
				grounded = false;
			
			}
		}
	
	void OnCollisionEnter(Collision hit)
	{
		grounded = true;
	}
	
	
}
