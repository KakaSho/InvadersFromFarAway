using UnityEngine;
using System.Collections;

public class AreaTranslucent : MonoBehaviour 
{
	public float m_Transparency = 0.3f; //variable de materiaux transparent
	bool transp = false;
	GameObject[] objetTransparent;
	
	
	void Start()
	{
		objetTransparent = GameObject.FindGameObjectsWithTag("BeObjTransparent");
		renderer.material.shader = Shader.Find("Diffuse");//Appplication Type de rendu Diffuse 
	}
	
	//Fonction GameObjetTransparent
	void BeTranslucent(GameObject objet)
	{
			Color CTransparent = renderer.material.color; //Définir la transparence
        	CTransparent.a = m_Transparency; //Mettre la couleur transparent en fonction a(alpha)
        	objet.renderer.material.color = CTransparent;//Rendre l'objet transparent
		    objet.renderer.material.shader = Shader.Find("Transparent/Diffuse");//Appplication Type de rendu Transparent 
	}
	
	void BeDiffuse(GameObject objet)
	{
			objet.renderer.material.shader = Shader.Find("Diffuse");//Appplication Type de rendu Diffuse 
	}
	
	//Fonction Transparent en entrer de Trigger
	void OnTriggerEnter(Collider ObjTranslucent) 
	{
	
		if(ObjTranslucent.gameObject.tag == "Player")
		{
			transp = true;
			doTransparant();
		}	
    }
	
	//Fonction Transparent en sortie de Trigger
	void OnTriggerExit(Collider ObjOpaque) 
	{    
		if(ObjOpaque.gameObject.tag == "Player")
		{
			transp = false;
			doTransparant();
		}
    }

	
	void doTransparant()
	{
		if(transp == true)
		{
			foreach(GameObject objet in objetTransparent)
			{
				BeTranslucent(objet);
			}
			 
		}
		if(transp == false)
		{
				foreach(GameObject objet in objetTransparent)
				{
					BeDiffuse(objet);
				}
		}
	}
	
	
}
