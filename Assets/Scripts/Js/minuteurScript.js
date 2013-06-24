public var porte : GameObject;
public var portePrefab;
public var porteOuverte : boolean = false;
public var minuteur : float;
public var chronoMinuteur : float; 
public var GameObjectTag : String;

function Start(){
	portePrefab = Instantiate(porte);
	chronoMinuteur = minuteur;
}

function Update(){
	if(porteOuverte){
		chronoMinuteur -= Time.deltaTime;
		if(chronoMinuteur <= 0)
		{
			portePrefab = Instantiate(porte);
			porteOuverte = false;
			chronoMinuteur = minuteur;
			
		}
	}
}


function OnTriggerEnter(objetInfo : Collider){
	/*******************************************************/
	//Activation levier tir avec minuteur
	/*******************************************************/
	if(objetInfo.gameObject.tag == GameObjectTag){
		if(!porteOuverte){
			
			Destroy(portePrefab);
			porteOuverte = true;
		}
	}	
}
