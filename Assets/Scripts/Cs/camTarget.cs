using UnityEngine;
using System.Collections;

public class camTarget : MonoBehaviour 
{
	
	public GameObject target = null; // Création du GameObject à cibler
	private Vector3 positionOffset = Vector3.zero; // Réinitialisation des positions

	void Start () 
	{
			positionOffset = transform.position - target.transform.position; // initialisation de la position de la camera
	}

	void Update () 
	{
	if (target != null)
		{
			transform.position = target.transform.position + positionOffset; // Camera cible objet en permanence
		}
	}
	
}
