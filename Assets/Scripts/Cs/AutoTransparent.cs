using UnityEngine;
using System.Collections;


public class AutoTransparent : MonoBehaviour
{
	private Shader m_OldShader = null; 
    private Color m_OldColor = Color.black;
    private float m_Transparency = 0.3f; //variable de materiaux transparent
    private float m_FallOff = 0.1f; // returns to 100% in 0.1 sec
	public  float m_TargetTransparancy = 0.3f; // variable 

 
    public void BeTransparent()
    {
        // initialisation de la transparence
        m_Transparency = m_TargetTransparancy;
        if (m_OldShader == null)
        {
            // sauvegarde les parametres du shader en cours
            m_OldShader = renderer.material.shader;
            m_OldColor  = renderer.material.color;
            renderer.material.shader = Shader.Find("Transparent/Diffuse");
        }
    }
    void Update()
    {
        if (m_Transparency < 1.0f) //condition si la transparance est inférieure à 1
        {
            Color C = renderer.material.color;
            C.a = m_Transparency;
            renderer.material.color = C;
        }
        else
        {
            // Reset du shader
            renderer.material.shader = m_OldShader;
            renderer.material.color = m_OldColor;
            // retirer tout le script
            Destroy(this);
        }
        m_Transparency += ((1.0f-m_TargetTransparancy)*Time.deltaTime) / m_FallOff;
    }
}