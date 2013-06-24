	
/*////////////////////////////////////*/
//Déclaration des variables liées au Tir								 
/*////////////////////////////////////*/
	public var bullet : Transform; //type de la variable Bullet, associer a un GameObject
	public var bulletDistance : float = 800; //variable de reglage de la distance du bullets
	public var spawnBullet : Transform; //type de la variable SpawnBullet, déternime la position d'un GameObject ( un gun )
	public var bulletTime : float = 1; //Temps de tir
	private var shotReady = false; // Test si le shot est vrai


/*////////////////////////////////////*/
//Fonction de Tir								 
/*////////////////////////////////////*/	
	
	function doShoot ()
	{
		shotReady = true;
		if(shotReady == true)
		{
			yield WaitForSeconds (bulletTime);
			var shot =Instantiate(bullet, spawnBullet.transform.position, Quaternion.identity);
			shot.rigidbody.AddForce(transform.forward * bulletDistance);
			shotReady = false;
			
		}	
	}
	
	
		
			
					
/*////////////////////////////////////*/
//Fonction de Update par frame							 
/*////////////////////////////////////*/	
	
function Update ()
{
	if(Input.GetButtonDown("Fire1"))
	{
		doShoot ();
	}
		
}