#pragma strict

var timeDestuctionObject : float = 5;


function Awake()
{
	Destroy (gameObject, timeDestuctionObject);

}