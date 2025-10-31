import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Mail,
    Plus,
    Edit,
    Copy,
    Trash2,
    Eye,
    BarChart3,
    Calendar,
    User,
    Search,
    Loader2,
    CheckCircle,
    Download,
    Temple,
    Heart,
    Users,
    Gift
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCommunicationTemplates, useCreateCommunicationTemplate } from '@/hooks/use-complete-api';
import { useToast } from '@/hooks/use-toast';

// Pre-built Temple Email Templates
const TEMPLE_TEMPLATES = [
    {
        name: "🏛️ Welcome to Temple Community",
        description: "Welcome new members to the temple community",
        category: "welcome",
        subject: "Welcome to {{temple_name}} - Your Spiritual Journey Begins",
        content: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #d97706; font-size: 28px; margin-bottom: 10px;">🏛️ Welcome to {{temple_name}}</h1>
        <p style="color: #666; font-size: 16px;">Your Spiritual Journey Begins Here</p>
    </div>
    
    <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; color: #92400e; font-size: 16px;">
            🙏 Namaste {{name}},
        </p>
    </div>
    
    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
        We are hanced;mplatesTabEnlt Tet defau
expor;
};
/div>
    )
        < )}  
         >Dialog</              
  gContent>  </Dialo                   </div>
                       utton>
        </B                   
 atempl Use This Te                     
          " />mr-2 w-4 ame="h-4classN <Copy                       
         Button>          <              on>
       </Butt                   ose
         Cl                        >
     (null)}TemplateSelected() => set onClick={"outline"n variant=<Butto                      >
      order-t"2 pt-6 bgap--end ifyex justame="fl<div classN                         
                      /div>
         <            
              )}               
   /div>      <                         
  </div>                              )}
      )                                   dge>
    }`}</Bariable}}${va">{`{{tlineant="ou vari{variable}dge key=       <Ba                                   ng) => (
  ble: striap((variavariables.mmplate.edTe    {select                              2">
      mt-ap-2  gx flex-wrapssName="fle   <div cla                         
        </Label>blesble VariavailaLabel>A      <                     
         div>        <                       
 th > 0 && (ables.lenglate.variTempselected && esblriate.vaTemplaedect       {sel                             
                 
   </div>                        div>
            </                       t }} />
 e.contenmplatelectedTel: stm_hrHTML={{ _slySetInnerounge     <div da                     
          y-auto">96 overflow-max-h-rounded order 4 bg-white b="p-ameiv classN<d                         
       /Label>review<ntent Pel>Email Co  <Lab                        v>
      di     <                        
                        
     </div>                
          ject}</div>.submplateTe>{selecteder" bord rounded3 bg-gray-50sName="p- clas     <div                      
     Label>bject Line</Suabel> <L                                <div>
                         
                            )}
                           p>
   scription}</Template.de>{selectedt-gray-600"="texlassName        <p c                    
    tion && (scripate.deempldTecte  {sel                                
                    </div>
                           </div>
                                   ()}
eStringtoLocaleDatated_at).e.crectedTemplatlesenew Date(d {      Create                         
     />w-4" sName="h-4 ndar clas       <Cale                           00">
  text-gray-6text-sm -1 enter gapitems-c"flex e=div classNam       <                      dge>
   tegory}</Bacae.tedTemplatlecline">{seariant="out<Badge v                              
  >p-4"nter ga items-ceme="flexsNa  <div clas                         
 ">-y-4e="spacessNam<div cla                        ader>
</DialogHe                   tle>
     DialogTie.name}</emplatectedTselle>{ialogTit  <D                  >
        alogHeader    <Di                 auto">
   overflow-y--[90vh] xl max-h-4-w"maxlassName=nt cntelogCo  <Dia              }>
    late(null)empelectedT={() => setSonOpenChangee} platectedTemn={!!selialog ope <D              && (
  ctedTemplate      {sele/}
      ail Modal *e Det Templat       {/*

      </Dialog>      tent>
     alogCon</Di          
         </div>         
        iv>   </d                    n>
   </Butto                        )}
                                />
   <                             
      ate Template  Cre                                 />
     w-4 mr-2" e="w-4 e classNamrcleckCi         <Ch                                    <>
                              ) : (
                                </>
                              
       eating... Cr                                  
     te-spin" />anima4 h-4 mr-2 ="w-ame classNder2    <Loa                                 
    <>                         
          ? (Creating       {is                       >
   isCreating}sabled={e} dilatleCreateTempandk={honClic  <Button                      >
         </Button                        
     Preview                  
         -2" />4 w-4 mrssName="h-laEye c         <                >
       "inetl"ouriant=Button va     <                      ap-2">
 "flex gName= class    <div                    ton>
ut     </B          l
         nce Ca                          false)}>
 l(daShowCreateMo> setClick={() =on" t="outlinerianton va        <But                t">
t-6 border-tween pjustify-beflex ="assName cl<div                 iv>

       </d            Card>
              </           nt>
   onte  </CardC                         
 </div>                               ))}
                                   </Badge>
                                       }}}`}
   riable  {`{{${va                                          
      })}>                                       
  ble}}}``{{${variatent + te.conplawTemntent: ne        co                                      
     plate,.newTem  ..                                                te({
 NewTempla{() => set   onClick=                                       0"
     r:bg-gray-10 hoveerntcursor-poify-center "justiame=lassN" ceoutlin="le} variantey={variab  <Badge k                               (
        ble) =>aria(vte'].map(damount', ' 'aent_date',evname', ' 'event_il',ntact_ema_name', 'coemplemail', 'tname', 'e       {['                            p-2">
 s-4 gagrid-col2 md:d-cols-d gri="grimev classNa      <di                          t>
onten <CardC                         ader>
  CardHe   </                         >
itleardTables</Crimmon VadTitle>Co        <Car                 
       ardHeader>    <C                          <Card>
                
      /div>
     <         
           </p>                        ing.
   h formattd for ric supporte isHTML content. namic}} for dymeble_nase {{varia     U                           t-1">
t-gray-500 mex="text-sm t className  <p                          />
                    
         rows={12}                           
    ..."erel content haiML emer your HTr="Entceholde       pla                      e })}
   .target.valutent: ee, con..newTemplate({ .ewTemplat{(e) => setNnge=haonC                        }
        e.contentlatue={newTemp val                              ent"
 onttemplate-c"     id=                  
         xtarea<Te                      el>
      abTML) *</Ltent (H Connt">Emailcontelate-"tempFor=<Label html                              <div>
                   /div>

     <                      />
                     "
       le_name}}emp {{telcome to.g., Wr="eoldeehlac     p                       
    ue })}.valtarget subject: e.plate,.newTemate({ ..etNewTemple) => shange={(         onC                       }
ectsubjmplate.lue={newTe va                             ct"
  ubje"template-s        id=                      Input
    <                      Label>
    t Line *</bjec">Sute-subject"templaor=el htmlFab<L                        iv>
          <d                 

 </div>                       >
   /                     
     ={2}ows          r             
         te..."his templause twhen to iption of "Brief descrder=lacehol       p                      })}
    et.valuetion: e.targescripe, d..newTemplat .mplate({NewTee) => set onChange={(                        n}
       scriptio.dewTemplate value={ne                        
       scription"mplate-de id="te                            xtarea
   Te           <                 abel>
on</Lriptin">Descioe-descript"templatl htmlFor=Labe         <                    <div>
               

            </div>            
              </div>                      Select>
</                               nt>
 lectConte  </Se                               ctItem>
   /Selel">General<e="generavalutem <SelectI                                       lectItem>
 Prayers</Serayer">"pm value=ectIteel        <S                          tem>
      electI</Slunteers">Voteeralue="volunItem vSelect    <                                    tem>
</SelectIationsion">Dononatvalue="dtItem       <Selec                                 tem>
 lectIvents</Se"event">Eue= vallectItemSe  <                            
          em>/SelectItlcome<welcome">We="tItem valuelec  <Se                                     
 nt>ectConte     <Sel                         >
      iggerectTr   </Sel                                 />
  category"Selecter="ldcehoue pla  <SelectVal                                  r>
    lectTrigge     <Se                          
        >                          
   lue })}ry: va categoemplate,..newTe({ .emplat=> setNewTe) (valueChange={     onValu                           gory}
    e.catelatTempewlue={n va                             
      elect  <S                              /Label>
egory *< <Label>Cat                            
         <div>                       </div>
                       />
                                  ber"
  New Mem., Welcome er="e.ghold      place                     
         .value })}e.targete: , namwTemplatelate({ ...ne setNewTemp=>{(e) e=nChang  o                                 te.name}
 wTemplalue={ne       va                         "
    namee-emplat id="t                                t
          <Inpu               
          Label>Name *</>Template ate-name"lFor="templ  <Label htm                          iv>
              <d            4">
      -cols-2 gap--1 md:gridrid-cols g="gridlassName civ   <d                  6">
   ="space-y-melassNa<div c                    

r>de </DialogHea             tle>
      ogTi/Diallate<mail TempNew Ee>Create  <DialogTitl                 r>
      ialogHeade<D                 o">
   utflow-y-a-[90vh] overxl max-hax-w-3"mName=ssnt claogConte       <Dial>
         eModal}howCreatange={setSnOpenChl} oreateModa{showCg open=alo      <Di     dal */}
 Momplate Create Te        {/* >

    /Dialog          <ontent>
  gC  </Dialo        div>
           </              tton>
 </Bu                   
     )}                                </>
                             Templates
TES.length}MPLE_TEMPLAInstall {TE                              />
      " h-4 mr-2"w-4 assName=ownload cl<D                              <>
                                (
      :  )                                </>
                        ...
     Installing                            >
       te-spin" /ima-2 an-4 h-4 mrssName="w2 claader<Lo                          
                <>                          (
 sCreating ?     {i                       eating}>
led={isCrisabemplates} dPrebuiltTk={installutton onClic     <B         
          >Button  </                  ncel
     Ca                         }>
  odal(false)uiltMhowPrebetS) => sClick={(" ontlinent="ouon varia    <Butt                 
   ">-tpt-6 border-between fylex justiame="fiv classN <d        
                               </div>
                  /div>
   <                     }
          ))                        </div>
                        
    /Badge>}<tegorycaplate."mt-2">{tem=Nameline" classnt="oute varia   <Badg                             
    p>}</scriptionlate.demt-1">{temp600 m text-gray-xt-sme="teassNa  <p cl                              >
    e.name}</h4latum">{tempnt-medi"foName= class         <h4                          p-4">
  rounded-lgrder sName="boclasndex} v key={idi   <                      (
       index) => ate, pl(temPLATES.map( {TEMPLE_TEM                  
         ">ls-2 gap-4rid-cod:g-1 mcolsrid-ame="grid gdiv classN      <                    
                    p>
        </         :
         nd includemmunities a coor templey crafted fpecificall semplates areese t     Th                        quickly. 
artedget stplates to tememail gned temple ly desiessional prof Install our                          y-600">
 xt-grae="te<p classNam                        -4">
e-ysName="spacdiv clas      <           
                     
  ogHeader>    </Dial              tle>
  /DialogTimplates<Te Email plell Teme>InstaTitlDialog <                     der>
  ialogHea       <D          ">
   2xl-w-axName="ment classDialogCont    <       al}>
     tModPrebuilowe={setShangOpenChModal} onuiltebwPr{shoDialog open=    <       }
  */Modals emplatet Te-builPr Install    {/*        )}

            v>
     </di        ))}
                 >
           </Card                ent>
    ardCont    </C                   v>
      </di                             
   </div>                                 tton>
          </Bu                               />
 h-3 w-3" Name="it class      <Ed                               ">
       tline"ou" variant="smn size=<Butto                                       on>
     </Butt                                  " />
  ="h-3 w-3ssNameopy cla<C                                         >
   line"ant="outsm" varisize="Button      <                                 n>
   </Butto                                  
     ew         Vi                                 " />
  r-13 m"h-3 w-lassName=  <Eye c                                     >
     e(template)}edTemplat=> setSelectnClick={() lex-1" oName="f class="outline"ntvaria" mze="sButton si   <                                   ">
   gap-2 pt-2e="flexsNamdiv clas    <                                )}

                                v>
    di         </                               </div>
                                      
              )}                                   >
        </Badge                                           
       - 3} morelengthiables.late.var  +{temp                                                   >
   "e="text-xsNamary" classnt="secondiae var  <Badg                                           (
       th > 3 && ngvariables.leplate.{tem                                                     ))}
                                         
  Badge>  </                                                
  able}}}`} {`{{${vari                                                    
   xs">text-me="ssNay" clandareco"st=} variany={variable<Badge ke                                                    => (
 string)able: ).map((vari0, 3ce(s.slile.variab  {template                                             
 p gap-1">ex-wrax fle="fleassNam <div cl                                     v>
      es:</diVariabl mb-2">-medium fontme="text-smdiv classNa          <                                    <div>
                                       0 && (
length >.variables.ate&& templs ate.variable {templ                                       
                               v>
 /di    <                             t}
   e.subjec> {templatt:</strong>Subjecng    <stro                                >
    "text-sm"sName=div clas  <                                 
 e-y-3">pacme="sssNadiv cla  <                           ent>
     <CardCont                     
     er>ardHead       </C                 /p>
    ription}<mplate.desc-600">{teray text-g"text-smclassName=      <p                    >
       </div                               e>
 egory}</Badgmplate.catne">{tet="outliarianBadge v  <                               >
   TitleCard}</mete.natemplatext-lg">{lassName="e cCardTitl          <                 >
         en"tify-betweuser j-cent itemsex"flassName=div cl   <                             er>
  <CardHead                      ">
    adowon-sh transitishadow-lg"hover:me=lassNate.id} cmpla key={teard    <C               (
     ate) => pls.map((temteredTempla{filte                ">
    ls-3 gap-6grid-co lg:cols-2 md:grid-grid-cols-1e="grid div classNam        <         ) : (

              </Card>     
        ardContent>         </C
           iv>    </d             
       </Button>                     e
       lat TempCreate                           
     mr-2" />"h-4 w-4 className=  <Plus                            
   e)}>eModal(trutShowCreat) => seonClick={(" neiant="outliar  <Button v                          )}
                   
          </Button>                            ates
   emplall Temple T  Inst                           
       r-2" />w-4 m"h-4 sName=wnload clas <Do                              ue)}>
     tModal(trilowPrebu) => setShck={(nCli oon  <Butt                        (
       0 &&h === es.lengt    {templat                
        er">justify-centp-3 ex gae="flNam <div class                   >
      </p                     
       }                    
  a."terisearch cri your ch mattemplatesNo       : "                    n."
      owr creating your templates olt temple  our pre-builingby instald Get starte      ? "                      = 0 
    ==tes.length    {templa                        mb-6">
 ground ted-fore-muxtme="te  <p classNa                >
      d</h3lates Founmpo Teold mb-2">Nibxl font-semtext-sName="clas    <h3                 4" />
    -auto mb- mxd-foreground6 text-mutew-16 h-1ame="classNl       <Mai                  nter">
-cep-12 texte="ssNamContent cla<Card             d>
          <Car           == 0 ? (
   =engthdTemplates.lrefilte {         id */}
  es Gr {/* Templat           ard>

       </Ctent>
      </CardCon         iv>
          </d             >
   ct  </Sele             
         Content>   </Select                         
   })}                           );
                                    Item>
     </Select                               
      </div>                                        me}
    .na  {category                                      
         />4 w-4"assName="h-    <Icon cl                                       >
      gap-2"centeritems-flex ssName="<div cla                                  
          gory.id}>={cate} value.idey={categoryctItem k <Sele                                       (
 eturn r                                 icon;
   = category.st Icon       con                           
  ) => {p((categoryategories.ma{c                              ontent>
  tCec<Sel                 
           tTrigger>elec         </S           />
         category" er by="Filteholderlue plac <SelectVa                       
        me="w-48">r classNalectTrigge       <Se              }>
       veCategorytisetAcge={ValueChanCategory} onvee={actilect valu  <Se           
           iv>   </d                 
       </div>                         
      />                       
   ="pl-10"Name      class                       )}
       rget.value.tarchTerm(e setSeae={(e) =>     onChang                       
        earchTerm}={s      value                             es..."
 atplh tem"Searcder= placehol                                ut
       <Inp                            -4" />
y-400 h-4 wext-gra1/2 ttranslate-y-m -sfor2 tranop-1/3 tte left-me="absoluNassSearch cla      <                       tive">
   sName="rela<div clas                          ">
  me="flex-1ssNacla      <div                 -4">
  "flex gap=v className        <di            -4">
e="pssNament cla <CardCont     
          ><Card       /}
     and Filter *rch      {/* Sea      
  </div>

           </div>              
    </Button>             late
     mp Te Create                     />
    w-4 mr-2"e="h-4us classNam    <Pl                 e)}>
   ateModal(truetShowCre s{() =>lick=ton onC    <But     
            )}              
     on>/Butt           <             es
mple TemplatTestall   In                          " />
w-4 mr-2e="h-4 ad classNam  <Downlo                          al(true)}>
tModrebuil setShowP=>k={() ine" onClic="outlariant <Button v                      (
 & 0 &ength === tes.ltempla    {      
          -3">e="flex gapiv classNam       <d     
    /div> <     
          p> community</pletemes for your mplatemail teiful nage beaut and mate>Crea-600"-gray"textName=<p class                  >
  es</h2atail Templ">Temple Emont-bold f"text-2xlsName= clas         <h2             <div>
             nter">
  items-cetweenify-beustame="flex jdiv classN     <       tions */}
der Ac {/* Hea           -6">
e="space-yam<div classN       urn (
 et   r

 ;
    }>
        )    </div   div>
         </           ...</p>
  templatesnd">Loading-foregrouxt-mutedame="tesN  <p clas              >
    " /uto mb-4fron mx-ample-safin text-temate-sph-12 ani"w-12 ame=er2 classN     <Load          >
     ext-center""tme=classNadiv      <           r h-96">
ente justify-cems-centerex itName="fl  <div class     urn (
         ret   oading) {
  (isL  if;

      ]il }
icon: Ma, 'General', name: l'genera { id: ',
       ple }: Temrs', iconPrayeme: 'rayer', nad: 'p{ i
        ,ers }n: Useers', icoe: 'Voluntnteer', nam 'volu    { id:    },
 : Gifts', icone: 'Donationtion', nam { id: 'dona    ndar },
   les', icon: Came: 'Eventnaevent',     { id: 't },
    , icon: Heare' 'Welcomame:, n 'welcome'   { id:},
      Mail con: iemplates',: 'All T'all', name    { id: es = [
    tegori  const ca

  ;   )Case())
 oweroLrchTerm.tsea).includes(toLowerCase(tion?.cripese.dtemplat      ||
  e()) LowerCasm.tochTercludes(searrCase().in.name.toLoweate      template =>
  (templter.fileses = templatmplat filteredTeconst  };

    
  
        }ng(false);reati   setIsC{
         inally      } f });
           tive",
   : "destrucariant         v        again.",
e tryPleasplate. eate temFailed to crn: "riptio        desc      iled",
  n Fa"Creatioe:     titl          toast({
             ) {
 (error} catch         h();
refetc        alse);
    ateModal(fwCresetSho      
          ;
               })     iables: []
   var     ',
        ent: '     cont           : '',
  subject     
         ral',ney: 'ge    categor          ',
  ription: '    desc         
   e: '',        nam{
        e(NewTemplatet  s                  
 
           });ly.",
    ccessful created subeenate has emplail tour emription: "Y      desc
          Created!",ate Templ   title: "         
        toast({    
           
     wTemplate);ync(neAsateMutation.mutteTemplatecreaait     aw          try {
      
ue);ing(tr setIsCreat}

       
             return;
                });   tive",
"destrucvariant:             ",
    elds.required fil alse fill in Pleaion: "escript d           
    ion", Informatissing title: "M               toast({
         ) {
   late.contentwTemp || !nee.subject!newTemplatme || ate.na (!newTempl  if> {
      c () =te = asynateTemplarehandleCst 

    con}
    };
        alse);g(fCreatin  setIs        y {
     } finall     });
           ",
 ve"destructiariant:            vn.",
     ailease try ag. Pemplatestall some tailed to insiption: "Fdescr          ",
      ledon Fai"Installatititle:                  toast({
    
       (error) {   } catch se);
     aliltModal(fShowPrebu        set;
       refetch()        
            
 });      
      s.`,l templateple emai} temTES.lengthMPLE_TEMPLAalled ${TEully inst `Successfcription:des            ",
    stalled!mplates In"Te     title:           {
 t(     toas
             
           });
                  }     variables
emplate.variables: t                   t,
 te.contenempla content: t            
       e.subject,ect: templatbj          su       ,
   .categoryemplatey: tgor   cate              
   on,iptite.descrion: templa   descript                e.name,
 templat    name:          {
       utateAsync(ation.mutateTemplateM   await cre             {
 TES)TEMPLA of TEMPLE_nst templatefor (co            try {
     rue);
   ing(t setIsCreat       {
nc () => lates = asyPrebuiltTempnst installs
    cotelt templaall pre-buist// In;

        })ng[]
 as striariables: []     v   nt: '',
nte co  ',
      'ct:   subje    l',
 generary: 'tego      caon: '',
  scriptide        
'',  name: ({
      eStateate] = ustNewTempl seewTemplate,t [n
    consata || [];
a?.dtesDat = templatesnst templa    co  
late();
  TempmmunicationCreateCo= usetion MutaatempleTeconst creat   ;
    
 00
    })    limit: 1
    ory,Categctive: aefined undl' ? = 'alategory ==y: activeCategor        cs({
tenTemplaCommunicatiotch } = useoading, refe isLatesData,a: templatonst { dAPI
    crom plates f temFetch//    
    ();
 Toastuse} = st { toat ns;

    cotate(false)] = useSebuiltModall, setShowPrtModabuilshowPre [ constlse);
   ate(faing] = useSttIsCreatseg, isCreatin
    const [ull);ate<any>(n useState] =empledTtSelectmplate, sedTenst [selecte cote('');
   ] = useStaetSearchTermTerm, schst [searcon
    ate(false);dal] = useSthowCreateMoeModal, setSshowCreat    const [;
ate('all')ry] = useStgoCateActiveory, setveCategconst [acti
    > { = () = React.FCnhanced:emplatesTabEconst T;

"]
    }
]le_name "temp_3",al_programci", "speprogram_2l_"specia", program_1ial_ "spectime",", "night_timeng_nime", "eve "midday_ti_time","morning"date", les: [riab
        vaiv>`,iv>
</d/p>
    </d <     ttee
  ommiayer Cname}} Prle_  {{temp          <br>
essings,e blin  With div          in: 0;">
: 12px; margont-size #9ca3af; fr:"coloyle= st
        <p;">top: 20pxeb; padding-e5e7px solid #rder-top: 1; botergn: cen-ali"textstyle=   <div     
  </div>
 </p>
       dhi
   a Ganahatm soul." - Mging of the is a long. Itt askinr is no  "Praye
          ic;">yle: italfont-st;  centerext-align: tx;14p: ont-size; flor: #581c87; co"margin: 0tyle= s  <p
      >: 20px 0;"px; margin-radius: 8er; bord 15pxf; padding:3e8fd: #f"backgroun <div style=    
       </div>
      </p>
ation.
   and meditus in prayerto join come ll are wel       A    
 ">size: 16px;ont-51; f: #3741lortyle="co     <p s>
   ;"0px 0argin: 3r; mente cn:text-aligstyle="v  <di 
   
   div>    </</ul>
     li>
   rogram_3}}</l_pecia  <li>{{sp          m_2}}</li>
rograspecial_p<li>{{      li>
      rogram_1}}</>{{special_p       <li
     8;">height: 1. line-151;374olor: #le="c<ul sty      /h3>
   Today<Programscial ">🌟 Spe 0;rgin-top:; ma9669 #05color:3 style="     <h;">
   in: 20px 0px; margus: 8radi; border-adding: 20px; pcfdf5: #eckgroundyle="ba    <div st>
    
    </divtable>

        <//tr>        <  </td>
  ht_time}}{{nig right;">-align:; textng: 12px 0e="paddi<td styl          
      rti</td>t Aaigh bold;">🌙 Night:-we 0; fontdding: 12pxstyle="pa <td             <tr>
              tr>
   </     
     e}}</td>g_timin{{evenght;">ign: ri; text-alg: 12px 0paddintd style="  <           >
   ayer</tdvening Prd;">🌆 E bolht:-weig font 0;2pxdding: 1tyle="pa    <td s           
 eb;">solid #e5e7 1px tom:otr-btyle="borde str  <         </tr>
            }}</td>
 timemidday_ right;">{{-align: textx 0;ding: 12pad"ptd style=  <             
 > Aarti</td">☀️ Middayd;ht: bolfont-weigpx 0; "padding: 12d style=     <t      ;">
     ebd #e5e7px soli: 1ttomrder-boe="bor styl   <t         
     </tr>    
   me}}</td>g_ti{{mornin">t;n: righ; text-alig: 12px 0="paddingtd style        <    
    er</td>Morning Prayld;">🌅 -weight: bo12px 0; font"padding:   <td style=         ">
     5e7eb;id #ex soltom: 1pr-bot"borde <tr style=         apse;">
  e: collllapsorder-co b: #374151;00%; color"width: 1le=ble sty<ta     /h3>
   {{date}}<Schedule -  Today's enter;">📅gn: cli 0; text-ap:-to06; marginor: #d977"colstyle=h3 
        <">gin: 20px 0; mar8px;radius: ; border-0pxg: 2inpaddf6; ound: #f3f4yle="backgriv st   <d
 
        </p>nection.
ine condivnd peace in  fiprayers andfor daily ity tual communiri spJoin our">
        n: center;ig151; text-al#374or: ht: 1.6; colne-heig6px; li: 1"font-sizee=  <p styl
  v>
    
    </di>       </p Shanti
 nti Shanti Sha        🙏 Om
     center;">ext-align:6px; t: 1 font-size400e; #92n: 0; color:yle="margi    <p st    0px;">
ottom: 2n-b margi: 8px;r-radiusborde 20px; c7; padding:ef3round: #fle="backg    <div stydiv>
    
>
    </ship</pored Wn Us in Sacroi>J;"ze: 16pxsit-66; fonolor: #6e="c     <p styl/h1>
   r Schedule<Daily Praye">🕉️ 0px;ottom: 1argin-bze: 28px; m6; font-sir: #d9770"coloe=styl  <h1 >
      om: 30px;"ott-bmarginer; -align: centtextle="div sty  <20px;">
   padding: to;au 0 margin:px; : 600 max-width sans-serif;y: Arial,font-famil"style=`
<div ntent: 
        come}}", {{temple_nachedule -ly Prayer Sject: "Dai   sub",
     "prayerory: ateg
        cmunity",with commings prayer tiShare daily ion: " descript       e",
edulrayer Schly P"🕉️ Dai    name:    {
      },
   e"]
"temple_nam_email", ordinatorco", "r_namerdinato, "cootion"t_locae", "shif_timift "sht_date", "shif",ame "shift_name",_nolunteerables: ["v vari
       >
</div>`,    </div      </p>
  nteer Team
_name}} Volu{temple       {
     ervice,<br> sesselflr sou for youThank y  
          ">; margin: 0;t-size: 12pxfona3af; "color: #9c   <p style=x;">
     op: 20png-t7eb; paddix solid #e5etop: 1per; border- centlign:yle="text-a<div st    iv>
    
</d</p>
            ammad Ali
Muh" - earth.oom here on for your rnt you pay  rehers is thece to ot    "Servi>
        lic;"-style: itaenter; font-align: c4px; text 1e:0e; font-siz40 color: #92"margin: 0;p style=>
        <px 0;"gin: 20; mardius: 8pxrarder-15px; bo padding: : #fef3c7;kgroundactyle="biv s   <d 
    >
 </div</p>
           .
 as possibleil}} as soonemainator_{coordt {acPlease contt? an't make i         C">
   e: 16px;51; font-sizcolor: #3741<p style="       
  0;">in: 30pxr; margn: cente-aligyle="textstdiv 
    <   
   </div>l>
          </urt</li>
en heade and opitive attitu Bring a pos      <li>😊li>
      </terg waated - brin Stay hydrli>💧   <         ation</li>
 coordinphone foring your  <li>📱 Br       </li>
    t clothingtable, modesor>👕 Wear comf      <li   i>
   tes early</lnu 15 miArrive>🕐       <li  .8;">
    t: 1ine-heigh; l374151olor: # style="c    <ul
    </h3>ememberring/Rhat to B📝 W">-top: 0;; margin: #059669orolle="c3 sty<h
        ">;20px 0x; margin:  8pr-radius:deg: 20px; boraddinfdf5; pund: #ecbackgrotyle="v s
    <di</div>
    e>
    bl/ta     <tr>
   me}}</td></ordinator_na<td>{{cotrong></td>:</sdinatorng>Coor"><strox 0; 8p="padding:td styler><      <t/tr>
      ><}}</tdt_location<td>{{shiftd>ong></n:</strg>Locatio0;"><stron 8px padding:="ler><td sty    <t
        d></tr>ft_time}}</t<td>{{shitd>ng></e:</stroim><strong>T 8px 0;"ding:ad"p=><td style      <tr     r>
 e}}</td></t>{{shift_datg></td><tdstronong>Date:</><str: 8px 0;"dingtyle="pad><td s <tr         td></tr>
  ift_name}}<//td><td>{{shrong><t:</stShifong>0;"><string: 8px paddstyle="<tr><td    
         74151;">color: #3 100%; ="width:tyletable s   <3>
     tails</hShift De📋 p: 0;">gin-tomar26;  #dc26color:h3 style="   <">
     26;c26 #dpx solidleft: 4rder-; bo 0margin: 20px8px; -radius: ; border: 20pxdingad6; p: #f3f4fnd"backgrouiv style=   <d>
    
 y!
    </pple communitving our temment to sermitur comor yo f. Thank youomorrowr shift tour volunteeut yboer aly remindnd frie This is a">
       74151;6; color: #31.ne-height: lix;  16p"font-size:yle=st
    <p div>
     </>
   </p
        me}},nteer_naear {{volu  🙏 D       ">
   px;size: 16b; font-991b1 # 0; color:="margin:yle st      <p">
  tom: 20px;margin-botius: 8px; der-radorpx; bdding: 20; paund: #fef2f2e="backgrostylv    
    <di</div>
 s</p>
    aitice Awd Serv Sacre>Yourx;"16pe: nt-sizor: #666; fostyle="col       <p </h1>
 ift Reminderolunteer Sh">📅 V10px;ottom: argin-b8px; m: 2-size26; font26or: #dcstyle="col        <h1 
px;">m: 30ottorgin-ber; maent: c"text-alignstyle=
    <div ;">: 20pxo; paddingin: 0 aut 600px; margidth:if; max-wans-serly: Arial, smile="font-fatyv s: `
<di content,
       ift_name}}" {{show -Shift Tomorrer VolunteYour Reminder:  subject: "",
       "volunteercategory: 
        ts",oming shif their upcers ofolunte "Remind vion:  descript     inder",
 Shift Remr untee"📅 Vol    name: 
    {
    "]
    },ailator_emdineer_coor, "voluntple_name"emame", "t["ns:  variable   v>`,
    
</di</div></p>
            tee
itCommr }} Volunteeametemple_n    {{      >
  vice,<br your serorde ftitura    With g  
      gin: 0;">px; marize: 12af; font-sr: #9ca3="colo  <p style  x;">
    : 20p padding-top7eb;solid #e5e 1px order-top: bter;centext-align: style="  <div 
    
      </div>>
  </p    
  "hers.vice of otf in the serose yoursel is to lyourselfind est way to f"The b        
    ">yle: italic;-stter; fontalign: centext-ze: 14px; 0e; font-sior: #92400; colargin: p style="m>
        <0;"0px ; margin: 2pxius: 8; border-radng: 15pxaddi3c7; p #fefbackground:iv style="
    <d    iv>
v>
    </d/di       <    </p>
 
        r_email}}dinatooor_ceer{{voluntct us at Serve? Conta  Ready to          
     ;">eight: bold16px; font-we:  font-sizrgin: 0;matyle="  <p s         lock;">
 -by: inlinepla 8px; disius: border-radx;15px 30pg: te; paddinlor: whico #7c3aed; und:le="backgro    <div sty
    x 0;"> margin: 30pgn: center;li"text-av style=   
    <di>
    </div>
  </ul      li>
 ce</sacred servigs through eive blessin>🙏 Rec     <lili>
       ommunity</ur c o inpactul immeaningf️ Make a  <li>❤         ces</li>
  riens and expe new skill Develop      <li>💪li>
      rs</embecommunity mnded ke-minect with li  <li>👥 Con          
ice</li>ervss srough selflethtual growth Spiri  <li>🧘   >
        ;".8ht: 1heig4151; line-or: #37le="col<ul sty       
 >/h3eering<oluntefits of V 0;">✨ Benrgin-top:59669; ma="color: #0tyle3 s
        <h0;">: 20px marginius: 8px; order-rad; bpx 20ng:; paddif5ecfdround: #"backg style= <div   v>
    
 </dil>
   /u        <</li>
ogramsural pric and cult>🎵 Mus  <li          rt</li>
nical suppo and technistrative<li>💻 Admi           li>
 dination</ortion and cont organiza   <li>🎉 Eve>
         </lil programs schoo Sundayeaching in Tli>📚    <       >
 </li preparationdamand prasaen service ️ Kitch     <li>🍽  /li>
     cleaning<e and maintenancle  Temp  <li>🏛️       .8;">
   -height: 1ine74151; l: #3tyle="color       <ul ses</h3>
 nitiOpportuer lunte Vo-top: 0;">🌟aed; margin: #7c3yle="color    <h3 st">
    in: 20px 0;8px; margus: -radi border20px;6; padding: 3f4f#fbackground: div style="  <
    
  
    </p>r community. with ouonnect clly andituao grow spirut alstemple bport our  only supva), we not service (seselfless. Through ple_name}}temity at {{communer r volunteo join ou tvite youe in      W">
  51;color: #3741ight: 1.6; x; line-he: 16pfont-sizele="ty<p s  
    
  iv>/dp>
    <</},
        ame}ear {{n    🙏 D  ;">
       16pxnt-size:7; fo #581c8: 0; color:gin"mar<p style=       ;">
 m: 20px-bottomarginus: 8px; di; border-radding: 20pxe8ff; pand: #f3rou="backgtyle    <div sdiv>
    
</</p>
    tyeer Communiuntin Our Vol;">Joze: 16px6; font-si"color: #66p style=      <
  y</h1>rtunitService Oppo>🤝 Sacred  10px;"gin-bottom:: 28px; maront-sizeaed; folor: #7c3tyle="c1 s <h      0px;">
 : 3ttombomargin-ter; lign: cen"text-av style=">
    <di0px;padding: 2: 0 auto; px; margin00ax-width: 6f; ml, sans-seri Ariant-family:e="fo`
<div styl content:       
 ",}}mple_nameity at {{teeer Opportunce - Voluntred ServiOur Sac "Join ject: sub      teer",
 : "volun    categorys",
    nitieteer opportu to volunrsInvite memben: "descriptio      ",
   Invitationpportunity Volunteer O "🤝     name:
    {
   
    },l"]ontact_emai, "c"_id"tax", odt_methpaymen, "n_purpose"natio"do, on_date"natido", ""amounter", ipt_numbe", "recenam", "temple_r_nameno: ["dolesiab     var   
</div>`,
> </div/p>
   
        <inistration} Adme_name}  {{templ    r>
      itude,<btfelt grat hearith     W       ">
0; 0  10px 0n:12px; margie: f; font-siz #9ca3aolor:="c <p style  /p>
            <_email}}
 ntact{{co | Contact: : {{tax_id}}   Tax ID       <br>
  le donation.deductib your tax- ofknowledgment as ac serveseipt  This rec
          x;">size: 14p font-b7280;or: #6le="colty   <p s">
     : 20px;toppadding-e7eb; lid #e5so-top: 1px rdercenter; bo-align: "texttyle= <div s
   iv>
    p>
    </d   </i
     Gandhahatma " - M others.ce of serviself in theto lose yours rself i to find youwayest e b"Th        ic;">
    style: italfont-6px; e: 1-sizont74151; f: #3="colortyle        <p s">
n: 30px 0;rgi; man: centeraligle="text-ty    <div sv>
    
di   </   </ul>
     li>
 ral events</and cultuivals  fest Organizingi>🎉<l            i>
atives</linitiach nd outrety service a🤝 Communi      <li>    li>
  ams</rogreducation pual ing spirit>📚 Fund    <lii>
        ls</land rituaily prayers ting da🕉️ Supporli>           <ises</li>
  temple premedr sacrintaining ouMai>🏛️ <l            8;">
 1.ht:ne-heig#374151; li"color:  style=   <ul</h3>
     elps Donation H>🌟 How Your-top: 0;"; margin #d97706lor:="cole  <h3 sty     x 0;">
 n: 20prgipx; maer-radius: 80px; bordpadding: 2 #fef3c7; d:rounkg style="bac    <div
    
</div>le>
       </tabr>
     td></tod}}</ment_methtd><td>{{payg></d:</stront MethoPaymeng><stronpx 0;">"padding: 8tyle=   <tr><td s         </td></tr>
pose}}tion_purd>{{donatd><t</trong>:</sosestrong>Purp;"><ng: 8px 0e="paddi<tr><td styl         tr>
   ate}}</td></ation_ddond>{{></td><tte:</strongDa"><strong>ing: 8px 0;style="padd  <tr><td          >
 </td></trnt}}ou>${{amd><tdrong></tAmount:</st>Donation ;"><strong: 8px 0"paddinge=td styl     <tr><    /tr>
   ><mber}}</tdceipt_nu{{retd><td>#g></onr:</strmbeNuceipt ><strong>Re 0;"adding: 8pxyle="p<td sttr>         <">
   4151;: #37100%; color: "widthe=tyltable s      <3>
   Receipt</hDonation">📋 in-top: 0;rg669; ma59lor: #0="co   <h3 style;">
     d #0596694px solit: ; border-lefn: 20px 0rgis: 8px; maadiurder-r 20px; bopadding:: #f3f4f6; "background<div style=
       /p>
 nity.
    <our commurve sion and seal mis our spirituus continueering helps sacred offour le_name}}. Ytempnation to {{ do generousor yourateful fly gre deep      We ar51;">
   #3741 color:ight: 1.6;x; line-he6pt-size: 1"fon<p style=
    v>
    di
    </</p>},
        nor_name} 🙏 Dear {{do
           ;">ze: 16pxnt-si#065f46; foolor: : 0; c"marginle=    <p sty    20px;">
n-bottom: x; margius: 8porder-radi; bng: 20px paddicfdf5;kground: #e"bacdiv style=   <  
 iv>
   </dion</p>
   ivine Missts Our Dpporerosity Su">Your Gene: 16px;iz6; font-scolor: #66"   <p style=     1>
Offering</hred or Your Sacank You fpx;">💝 Thottom: 10rgin-b 28px; mat-size:; fon: #059669e="color  <h1 styl">
      ttom: 30px; margin-bocenter;ign: xt-alv style="te>
    <di 20px;"adding:o; p: 0 aut marginidth: 600px;if; max-werns-sial, safamily: Are="font-
<div stylent: `   cont}}",
     pt_number#{{receieceipt  - ROfferingr Sacred You for You"Thank    subject: ,
     onation"ategory: "d  c    ",
   receiptione donatand providrs "Thank donoscription:         deeipt",
& Recu nk Yoon ThaDonati  name: "💝    {
      ,
 "]
    }_locationent"ev", t_timee", "evenevent_dat", "le_name, "templ_name"ivae", "festbles: ["nam      variav>`,
  di  </div>
</  p>
 </     e
  ommitte}} Event Cnameple_   {{tem        
 ings,<br>ssledivine bWith            
 0;">n: ; margipx: 12t-size3af; fon9ca="color: #yle    <p st
    ;">top: 20pxng-e7eb; paddisolid #e5-top: 1px orderenter; bxt-align: cv style="te<di 
    div>
   p>
    </
        </bration.sacred celef this here otmospe ao the divin will add tpresence   Your >
         ize: 16px;"t-s74151; fonlor: #3p style="co>
        <x 0;"in: 30pcenter; margxt-align: tyle="te  <div s>
    
   </div</ul>
         /li>
   fellowship<nitynd commu Blessings a     <li>🎁
       i>all</lor sed food) fdam (bles>🍽️ Prasa  <li     li>
     ans</ic and bhajonal mus>🎵 Devoti    <li  li>
      tuals</ayers and riial pr <li>🕉️ Spec  
          1.8;">ht:1; line-heig: #37415colore=" <ul styl>
       hts</h3ghligam Hi">🌟 Progrtop: 0;669; margin-: #059yle="color3 st  <h      ">
: 20px 0;rgin 8px; maradius:r-px; bordeing: 20addcfdf5; pkground: #ebace=" styliv    
    <d</div>
>
        </table  >
  ed</td></trpreferrre ttiional aadit</td><td>Trstrong>e:</s CodDres>👥 ><strong: 5px 0;"ingadd"ptd style=<tr><            /td></tr>
n}}<vent_locatio</td><td>{{e</strong> Location:<strong>📍x 0;">ding: 5p"padd style=  <tr><t   
       d></tr>}</tvent_time}/td><td>{{etrong><:</sTime>⏰ ng0;"><strong: 5px e="paddi<td styltr>         <d></tr>
   te}}</tdant_>{{eve/td><td:</strong><>📅 Date"><strongx 0;adding: 5p="p><td style        <tr>
    "1;7415color: #3th: 100%; ="widle style <tab   </h3>
    ent Details 0;">📅 Evin-top:rg#dc2626; ma"color: e= styl<h3      0;">
   in: 20px 8px; marg-radius:order0px; bg: 2paddin#f3f4f6; ground: back style="
    <div
    </p>  
  mple_name}}.te at {{me}}l_na{{festivaration of ous celebthe auspicius for in  joy tour famil yoe you and invitlly cordia  We      ;">
r: #374151; colo: 1.6-heightpx; line16ize: "font-s  <p style=   
  div>
  </
          </p>},
 {name}  🙏 Dear {         enter;">
 n: cig-al6px; textize: 1 font-s0e;lor: #9240co; ="margin: 0  <p style>
      ;" 20px-bottom:x; marginadius: 8ppx; border-rdding: 2000%); pad7aa 1f3c7 0%, #fefet(135deg, #adienlinear-grkground: yle="bac   <div st
    
    </div>tion</p>
 ed Celebraacrr Soin Outed to Ju're Invi6px;">Yo 1size:t-fonor: #666; "colp style= <      h1>
 tion</}} Celebraame{festival_n🎉 {">px;m: 10argin-botto28px; mize:  font-s#dc2626;e="color:   <h1 styl
      30px;">m: margin-bottoer; n: centext-aligyle="tdiv st">
    <ding: 20px;uto; padin: 0 apx; marg-width: 600; maxrifial, sans-seAramily: "font-f style=
<div: ` content       ame}}",
emple_nt {{tbration aCelename}} ival_or {{festin Us fct: "Jo     subjevent",
   ry: "e  catego",
      brationsletival cety to fesmuni"Invite comion: iptcr      des",
  Invitationration Celeb🎉 Festival e: "
        nam   {,
   }"]
  _phonetact"con", ilmaact_ee", "contple_namme", "tem["nariables:       vaiv>`,
  /ddiv>
<   </</p>
         tion
} Administrae}emple_nam         {{t  gs,<br>
 blessinith divine         W;">
    rgin: 0x; mat-size: 12p#9ca3af; fon"color: <p style=     ;">
   p: 20pxdding-to #e5e7eb; pasolid 1px -top: borderr;ign: centet-alstyle="tex    <div   
v>
      </di      </p>
ne}}
  {contact_phol}} or {act_emaintt us at {{cocontacons, please r any questiFo            : 14px;">
 font-size80;6b72="color: #   <p style    0px 0;">
 in: 3argnter; m: cegnt-alile="tex<div sty   
     </div>
 
      </ul>i>
     /lrtunities<oppoty service communiticipate in  <li>💝 Par           >
/li classes<programs anditual  spire ourlorli>📚 Exp        <    ees</li>
w devotith fellonect w🤝 Con  <li>          li>
ents</ evnd weeklyrayers aily p our da>📅 Join <li           : 1.8;">
ne-height51; li #3741le="color:   <ul sty  t?</h3>
    What's Nexop: 0;">🌟 margin-tr: #d97706;le="colo    <h3 sty 0;">
    n: 20px8px; margiradius: ; border-ing: 20px6; padd #f3f4fground:"back<div style=   p>
    
 
    </ey with you.ed journhis sacr td to sharinglook forwary, and we l famil spirituanriches ournce e! Your presele communityour tempe you to welcom to delighted