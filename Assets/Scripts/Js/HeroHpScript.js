#pragma strict
public var currentHp : int = 5;//Hp restant
public var maxHp : int = 5;//Hp maximum
public var currentLife : int = 3;//nombre de vie

function Start () {
	
}

function Update () {
	/*******************************************************/
	//perds une vie
	/*******************************************************/
	if(currentHp < 1)
	{
		currentLife -= 1;
		currentHp = maxHp;
	}
}

function OnTriggerEnter(objetInfo : Collider){
	/*******************************************************/
	//Heros toucher par un laser
	/*******************************************************/
	if(objetInfo.gameObject.tag == "Laser")
	{
		if(!GetComponent(BonusScript).bonusInvincible)
		{
			currentHp -= 1;
		}	
	}
}