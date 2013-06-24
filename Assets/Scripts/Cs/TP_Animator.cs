using UnityEngine;
using System.Collections;

public class TP_Animator : MonoBehaviour 
{
	
	public enum Direction
	{
		Stationary, Forward, Backward, Left, Right,
		LeftForward, RightForward, LeftBackward, RightBackward
	}
	
	public enum CharacterState
	{
		Idle, Running, WalkingBackwards, StrafingLeft, StrafingRight, Jumping,
		Falling, Landing, Climbing, Sliding, Using, Dead, ActionLocked
	}
	
	public static TP_Animator Instance;
	
	public Direction MoveDirection {get; set;}
	public CharacterState State {get; set;}
	
	void Awake()
	{
		Instance = this;
	}
	
	void Update()
	{
		DetermineCurrentState();
		ProcessCurrentState();
		
	}
	
	public void DetermineCurrentMoveDirection()
	{
		var forward = false;
		var backward = false;
		var left = false;
		var right = false;
		
		if(TP_Motor.Instance.MoveVector.z > 0)
			forward = true;
		
		if(TP_Motor.Instance.MoveVector.z < 0)
			backward = true;
		
		if(TP_Motor.Instance.MoveVector.x < 0)
			left = true;
		
		if(TP_Motor.Instance.MoveVector.x > 0)
			right = true;
		
		
		if(forward)
		{
			if(left)
				MoveDirection = Direction.LeftForward;
			else if (right)
				MoveDirection = Direction.RightForward;
			else
				MoveDirection = Direction.Forward;
		}
	
		else if(backward)
		{
			if(left)
				MoveDirection = Direction.LeftBackward;
			else if (right)
				MoveDirection = Direction.RightBackward;
			else
				MoveDirection = Direction.Backward;
			
		}
		
		else if(left)
		{
			MoveDirection = Direction.Left;
		}
		
		else if(right)
		{
			MoveDirection = Direction.Right;
		}
		
		else
		{
			MoveDirection = Direction.Stationary;
		}
		
		
	}
	
	void DetermineCurrentState()
	{
		
		if(	State == CharacterState.Dead )
		{
			return;
		}
		
		if(!TP_Controller.CharacterController.isGrounded)
		{
			if(	State != CharacterState.Falling &&
				State != CharacterState.Jumping &&
				State != CharacterState.Landing )
			{
			
			}
		}
		
		if( State != CharacterState.Falling &&
			State != CharacterState.Jumping &&
			State != CharacterState.Landing &&
			State != CharacterState.Using &&
			State != CharacterState.Climbing &&
			State != CharacterState.Sliding )
		{
			switch (MoveDirection)
			{
				case Direction.Stationary:
					State = CharacterState.Idle;
				break;	
				
				case Direction.Forward:
					State = CharacterState.Running;
				break;
				
				case Direction.Backward:
					State = CharacterState.WalkingBackwards;
				break;
				
				case Direction.Left:
					State = CharacterState.StrafingLeft;
				break;
				
				case Direction.Right:
					State = CharacterState.StrafingRight;
				break;
				
				case Direction.LeftForward:
					State = CharacterState.Running;
				break;
				
				case Direction.RightForward:
					State = CharacterState.Running;
				break;
				
				case Direction.LeftBackward:
					State = CharacterState.WalkingBackwards;
				break;
				
				case Direction.RightBackward:
					State = CharacterState.WalkingBackwards;
				break;
				
				
			}
			
		}
		
	}
	
	void ProcessCurrentState()
	{
		
		switch (State)
		{
			case CharacterState.Idle:
				Idle ();
			break;
			
			case CharacterState.Running:
				Running();
			break;
			
			case CharacterState.WalkingBackwards:
				WalkingBackwards();
			break;
			
			case CharacterState.StrafingLeft:
				StrafingLeft();
			break;
			
			case CharacterState.StrafingRight:
				StrafingRight();
			break;
			
			case CharacterState.Jumping:
			break;
			
			case CharacterState.Falling:
			break;
			
			case CharacterState.Landing:
			break;
			
			case CharacterState.Climbing:
			break;
			
			case CharacterState.Sliding:
			break;
			
			case CharacterState.Using:
			break;
			
			case CharacterState.Dead:
			break;
			
			case CharacterState.ActionLocked:
			break;
		}
		
	}
	
	void Idle()
	{
		animation.CrossFade("LoustikIdle");
	}
	
	void Running()
	{
		animation.CrossFade("LoustikRun");
	}
	
	void WalkingBackwards()
	{
		animation.CrossFade("LoustikWalk");
	}
	
	void StrafingLeft()
	{
		animation.CrossFade("LoustikRun");
	}
	
	void StrafingRight()
	{
		animation.CrossFade("LoustikRun");
	}
	
	
}
