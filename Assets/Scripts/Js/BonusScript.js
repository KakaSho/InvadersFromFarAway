public var total_piece : int = 0;//total des piece du niveau
public var sound_piece : AudioClip;//son joué lorsqu'on recupere une piece
public var bonusInvincible : boolean = false;//vérifie si le bonus d'invincibilité est actif
public var bonusMunitionIllimite : boolean = false;//vérifie si le bonus d'invincibilité est actif
public var bonusUpTime : float = 10.0;//paramètre la duréé du bonus d'invincibilité
public var fragment : int = 0;//total des fragment acquis
public var CartePrise : boolean = false;//test si le joueur a pris la carte



function Start () {
}

function Update(){
	/*******************************************************/
	//Decompte du chrnometre lorsque le heros a un bonus
	/*******************************************************/
	if(bonusInvincible == true)
	{
		bonusUpTime -= Time.deltaTime;
		if(bonusUpTime <= 0)
		{
			bonusInvincible = false;
			bonusUpTime = 10.0;
		}
	}
	else if(bonusMunitionIllimite == true)
	{
		bonusUpTime -= Time.deltaTime;
		if(bonusUpTime <= 0)
		{
			bonusMunitionIllimite = false;
			bonusUpTime = 10.0;
		}
	}

}//end function Update

function OnTriggerEnter(objetInfo : Collider)
{
	/*******************************************************/
	//recupération des pièces
	/*******************************************************/
	if(objetInfo.gameObject.tag == "Coins")
	{
		audio.PlayOneShot(sound_piece);
		Destroy(objetInfo.gameObject);	
		total_piece += 1;
	}
	/*******************************************************/
	//ajout d'une vie
	/*******************************************************/
	if(objetInfo.gameObject.tag == "Life")
	{
		Destroy(objetInfo.gameObject);	
		GetComponent(HeroHpScript).currentLife += 1;
	}
	/*******************************************************/
	//ajout de point de vie
	/*******************************************************/
	if(objetInfo.gameObject.tag == "Coeur")
	{
		if(GetComponent(HeroHpScript).currentHp != GetComponent(HeroHpScript).maxHp)
		{
			Destroy(objetInfo.gameObject);	
			GetComponent(HeroHpScript).currentHp += 1;
		}
	}
	/*******************************************************/
	//ajout d'un fragment de coeur si il en a quatre il gagne un hp supplémentaire
	/*******************************************************/
	if(objetInfo.gameObject.tag == "Fragment")
	{
		Destroy(objetInfo.gameObject);
		fragment += 1;
		if(fragment > 3)
		{
			GetComponent(HeroHpScript).maxHp += 1;
			fragment = 0;
		}
		
	}
	/*******************************************************/
	//octroie un bonus d'invincibilité pendant 10 secondes
	/*******************************************************/
	if(objetInfo.gameObject.tag == "Invincible")
	{
		Destroy(objetInfo.gameObject);
		bonusInvincible = true;	
	}
	/*******************************************************/
	//octroie un bonus d'invincibilité pendant 10 secondes
	/*******************************************************/
	if(objetInfo.gameObject.tag == "MunitionIllimite")
	{
		Destroy(objetInfo.gameObject);
		bonusMunitionIllimite = true;	
	}
	/*******************************************************/
	//ajoute des munitions au sac du héros
	/*******************************************************/
	if(objetInfo.gameObject.tag == "SacBillex10")
	{
		Destroy(objetInfo.gameObject);
		GetComponent(ControlePerso).munitionNormale += 10;
	}
	else if(objetInfo.gameObject.tag == "SacBillex20")
	{
		Destroy(objetInfo.gameObject);
		GetComponent(ControlePerso).munitionNormale += 20;
	}
	
	/*******************************************************/
	//ajoute une carte d'activation de levier
	/*******************************************************/
	if(objetInfo.gameObject.tag == "Carte")
	{
		Destroy(objetInfo.gameObject);
		CartePrise = true;
	}
}//end function OnTriggerEnter

