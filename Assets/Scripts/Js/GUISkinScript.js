//GUI SKIN
public var SDGUISkin : GUISkin;//Apparence du GUI
public var profilHeros : Texture;//Vignette affichant le personnage
public var SacDeBille : Texture;//Vignette affichant le sac de bille
public var HPHeros : Texture;//Apparence d'une barre de HP
public var HPHerosMax : Texture;//Apparence d'une barre de HP non active
public var HPHerosBonus : Texture;//Apparence d'une barre de HP non active
public var Heros : GameObject;//Heros
public var FragmentDeCoeur : Texture[];//apparence des coeurs
public var Bg_Hp : Texture;//apparence background barre de vie

//recuperation variable d'autre script
private var HP : int;//Hp restant
private var HPmax : int;//Hp Max
private var Life : int;//Nombre de vie
private var munitionRestante : int; //nombre de munition
private var illimite : boolean; //bonus munition illimitée
private var invincible : boolean; //bonus munition invincible
private var fragment : int; //nombre de fragment
private var piece : int; //recupere nombre de piece

//position Hp
private var positionHP : int;//position de la derniere barre de Hp
private var positionHPmax : int;//position de la barre de Hp max
private var positionTopBarreHp : int; //position de la barre d'HP
private var positionTopHp : int;

//Chronometre
private var startTime : float;//lancement du chrono
private var textTime : String;//affichage du chrono
private var guiTime;
private var minutes : int;
private var seconds : int;
private var positionLeftTimer : int;

//Ecran
private var LargeurEcran : float;
private var HauteurEcran : float;

//fragment
private var positionLeftFragment : int;
private var positionTopFragment : int;


//pièce
private var textPiece : String;//texte à afficher pour les pieces
private var positionLeftPiece : int;
private var positionTopPiece : int;


//munition
private var positionLeftMunition : int;
private var positionTopMunition : int;


function Awake(){
	startTime = Time.time;
	
}


function Update()
{
	/*******************************************************/
	//Recupération des variables
	/*******************************************************/
	HP = Heros.GetComponent(HeroHpScript).currentHp;
	HPmax = Heros.GetComponent(HeroHpScript).maxHp;
	Life = Heros.GetComponent(HeroHpScript).currentLife;
	//munitionRestante = Heros.GetComponent(FireShot).munitionNormale;
	illimite = Heros.GetComponent(BonusScript).bonusMunitionIllimite;
	invincible = Heros.GetComponent(BonusScript).bonusInvincible;
	piece = Heros.GetComponent(BonusScript).total_piece;
	fragment = Heros.GetComponent(BonusScript).fragment;
	LargeurEcran = Screen.width;
	HauteurEcran = Screen.height;
}

function OnGUI()
{
	GUI.skin = SDGUISkin;//import du GUI
	
	/*******************************************************/
	//Affichage des HPs
	/*******************************************************/
	
	
	var HPperdu = HPmax - HP;
	positionTopBarreHp = Mathf.Round(HauteurEcran - 117);//calcul position hauteur barre
	positionTopHp = Mathf.Round(HauteurEcran - 117 + 52);//calcul position hauteur barre
	GUI.DrawTexture(Rect(10,positionTopBarreHp,300,104), Bg_Hp);//affichage barre de vie
	for(var i = 0; i < HP ; i++)
	{
		positionHP = 110 + (12 * i) + (2 * i);
		if(!invincible)
		{
			GUI.DrawTexture(Rect(positionHP,positionTopHp,12,25), HPHeros);
		}
		else
		{
			GUI.DrawTexture(Rect(positionHP,positionTopHp,12,25), HPHerosBonus);
		}
		
	}
	if(HPperdu > 0)
	{
		for(var j = 0; j < HPperdu ; j++)
		{
			positionHPmax = positionHP + (14 * (j+1));
			GUI.DrawTexture(Rect(positionHPmax,positionTopHp,12,25), HPHerosMax);
		}
	}
	
	/*******************************************************/
	//Affichage du portrait du personnage
	/*******************************************************/
	GUI.DrawTexture(Rect(40,positionTopBarreHp,60,92), profilHeros);
	
	
	/*******************************************************/
	//Affichage des vie
	/*******************************************************/
	var nbrLife : String = "X" + Life;
	positionTopBarreHp = positionTopBarreHp + 65;
	GUI.Label(Rect(13,positionTopBarreHp,50,50),nbrLife, "LifeStyle");
	
	/*******************************************************/
	//Affichage du chronomètre
	/*******************************************************/
	guiTime = Time.time - startTime;
	minutes = guiTime / 60;
	seconds = guiTime % 60;
	positionLeftTimer = Mathf.Round((LargeurEcran-150)/2);
	
		
	textTime = String.Format("{0:00}:{1:00}", minutes, seconds);
	GUI.Label (Rect (positionLeftTimer, 10, 150, 119), textTime, "TimeStyle");
	
	/*******************************************************/
	//Affichage des coeurs
	/******************************************************/
	positionLeftFragment = Mathf.Round(LargeurEcran - 110);
	positionTopFragment = Mathf.Round(HauteurEcran - 117);
	GUI.DrawTexture(Rect(positionLeftFragment,positionTopFragment,100,107),FragmentDeCoeur[fragment]);
	
	/*******************************************************/
	//Affichage des pièces
	/******************************************************/
	textPiece = "x"+ piece;
	positionLeftPiece = Mathf.Round(positionLeftFragment - 110);
	positionTopPiece = Mathf.Round(positionTopFragment);
	
	GUI.Label (Rect (positionLeftPiece, positionTopPiece, 100, 91), textPiece, "CoinStyle");
	/*******************************************************/
	//Affichage des munition
	/*******************************************************/
	var munitionTexte : String = "x99";
	positionLeftMunition = Mathf.Round(positionLeftPiece - 110);
	positionTopMunition = Mathf.Round(positionTopFragment);
	GUI.Label(Rect(positionLeftMunition,positionTopMunition,100,81),munitionTexte, "MunitionStyle");



}