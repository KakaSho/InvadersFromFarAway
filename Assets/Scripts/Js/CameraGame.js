

public var target : GameObject = null; // Création de la variable GameObject

private var positionOffset = Vector3.zero; // Création de la variable du décalage de position

function Start () 
{
	positionOffset = transform.position - target.transform.position; // initialisation de la position de la camera
}

function Update () 
{

	if (target != null)
		{
			//transform.LookAt(target.transform); // Camera cible un objet de son choix
			transform.position = target.transform.position + positionOffset; // Camera cible objet en permanence
			
		}


}