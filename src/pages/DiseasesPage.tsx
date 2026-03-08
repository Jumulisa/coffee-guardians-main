import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle, Leaf, Bug, Droplets, Shield, BookOpen } from "lucide-react";

// Coffee disease reference data
const diseases = [
  {
    id: "healthy",
    name: "Healthy Leaf",
    nameRw: "Ikibabi Cyiza",
    scientificName: "N/A",
    severity: "none",
    icon: Leaf,
    color: "bg-green-500",
    description: "A healthy coffee leaf shows vibrant green coloration with no spots, discoloration, or damage. The leaf surface is smooth and the edges are intact.",
    descriptionRw: "Ikibabi cy'ikawa gifite ubuzima bwiza kigaragaza ibara ry'icyatsi gikomeye nta macunga, nta ibara ryahindutse, cyangwa nta byangiritse. Imbere y'ikibabi ni yoroshye kandi impande zacyo ni nzima.",
    symptoms: [
      "Uniform green color",
      "Smooth leaf surface",
      "No visible spots or lesions",
      "Intact leaf edges",
    ],
    symptomsRw: [
      "Ibara ry'icyatsi rimwe",
      "Imbere y'ikibabi yoroshye",
      "Nta macunga agaragara",
      "Impande z'ikibabi zuzuye",
    ],
    prevention: [
      "Regular inspection of plants",
      "Proper nutrition management",
      "Adequate spacing between plants",
      "Good drainage systems",
    ],
    preventionRw: [
      "Gusuzuma ibimera buri gihe",
      "Gucunga neza ifumbire",
      "Gutandukanya neza ibimera",
      "Uburyo bwiza bwo gukuramo amazi",
    ],
    treatment: null,
  },
  {
    id: "rust",
    name: "Coffee Leaf Rust",
    nameRw: "Imvura y'Ikibabi cy'Ikawa",
    scientificName: "Hemileia vastatrix",
    severity: "high",
    icon: AlertTriangle,
    color: "bg-orange-500",
    description: "Coffee leaf rust is the most devastating disease affecting coffee worldwide. It appears as yellow-orange powdery spots on the underside of leaves, eventually causing leaf drop and yield loss.",
    descriptionRw: "Imvura y'ikibabi cy'ikawa ni indwara yangiza cyane ikawa ku isi hose. Igaragara nk'utubara tw'umuhondo-orange twa bubiko ku ruhande rwo hasi rw'amababi, amaherezo igatuma amababi agwa n'umusaruro ukendera.",
    symptoms: [
      "Yellow-orange powdery spots on leaf undersides",
      "Spots appear circular, 3-15mm diameter",
      "Upper leaf surface shows pale yellow patches",
      "Premature leaf drop in severe cases",
      "Reduced flowering and fruit set",
    ],
    symptomsRw: [
      "Utubara tw'umuhondo-orange bubuke ku ruhande rwo hasi rw'amababi",
      "Utubara tugaragara nk'uruziga, ru diameter ya 3-15mm",
      "Imbere yo hejuru y'ikibabi igaragaza uturanga tw'umuhondo mucye",
      "Amababi agwa kare mu bihe bikomeye",
      "Indabo n'imbuto byoroheje",
    ],
    prevention: [
      "Plant resistant coffee varieties when possible",
      "Maintain proper plant spacing for air circulation",
      "Remove and destroy infected leaves",
      "Apply preventive fungicides during wet season",
      "Ensure good drainage to reduce humidity",
    ],
    preventionRw: [
      "Tera ubwoko bw'ikawa buhanganira indwara iyo bishoboka",
      "Shyira ahantu hakwiriye hagati y'ibimera kugira ngo umuyaga winjire",
      "Kuraho no gutwika amababi yandujwe",
      "Shyira umuti wa fungicide mbere y'igihe cy'imvura",
      "Menya neza ko amazi arasohoka kugira ngo ubuhehere bukendera",
    ],
    treatment: {
      action: "Apply copper-based fungicide (Bordeaux mixture)",
      actionRw: "Shyira umuti wa fungicide ushingiye ku muringa (Bordeaux mixture)",
      products: [
        "Copper hydroxide (2-3g/L water)",
        "Bordeaux mixture (100g copper sulfate + 100g lime in 10L water)",
        "Systemic fungicides like Azoxystrobin for severe cases",
      ],
      productsRw: [
        "Copper hydroxide (2-3g/L amazi)",
        "Bordeaux mixture (100g copper sulfate + 100g calcium mu mazi 10L)",
        "Umuti wa fungicide nka Azoxystrobin ku bihe bikomeye",
      ],
      timing: "Apply every 14 days during rainy season",
      timingRw: "Shyira buri minsi 14 mu gihe cy'imvura",
      cost: "2,500 - 4,000 RWF per treatment",
    },
  },
  {
    id: "miner",
    name: "Coffee Leaf Miner",
    nameRw: "Umubu w'Ikibabi cy'Ikawa",
    scientificName: "Leucoptera coffeella",
    severity: "moderate",
    icon: Bug,
    color: "bg-yellow-500",
    description: "Coffee leaf miner is a moth larvae that creates tunnels (mines) within coffee leaves. The damage reduces photosynthesis and can cause significant yield reduction if not controlled.",
    descriptionRw: "Umubu w'ikibabi cy'ikawa ni uruvunvu rw'inyenzi rucukura imyobo (mines) mu mababi y'ikawa. Ibyangiritse bigabanya photosynthèse kandi bishobora gutera kugabanya umusaruro cyane niba bidakurikiranwe.",
    symptoms: [
      "Serpentine or blotch-shaped mines on leaves",
      "Brown, dry patches where larvae have fed",
      "Small white or cream-colored larvae visible in mines",
      "Leaves may curl or become distorted",
      "Premature leaf fall in heavy infestations",
    ],
    symptomsRw: [
      "Imyobo ifite ishusho y'inzoka cyangwa ikibara ku mababi",
      "Uturanga twa bruni, twumye aho uruvunvu rwariye",
      "Uruvunvu ruto rw'umweru cyangwa cream rugaragara mu myobo",
      "Amababi ashobora kuzunguruka cyangwa kugoreka",
      "Amababi agwa kare iyo kwanduza ari gukabije",
    ],
    prevention: [
      "Regular monitoring for early detection",
      "Remove heavily infested leaves and destroy them",
      "Encourage natural predators (parasitic wasps)",
      "Avoid excessive nitrogen fertilization",
      "Maintain healthy, vigorous plants",
    ],
    preventionRw: [
      "Gukurikirana buri gihe kugira ngo umenye kare",
      "Kuraho amababi yandujwe cyane no kuyatwika",
      "Shishikariza abanzi basanzwe (inzige z'inyenzi)",
      "Irinde gukoresha ifumbire ya nitrogen nyinshi",
      "Gumana ibimera bifite ubuzima bwiza, bikomeye",
    ],
    treatment: {
      action: "Apply insecticide targeting leaf miners",
      actionRw: "Shyira umuti wishe udukoko ugamije abacukura amababi",
      products: [
        "Neem oil spray (organic option)",
        "Spinosad-based insecticides",
        "Imidacloprid for severe infestations",
      ],
      productsRw: [
        "Amavuta ya Neem (uburyo busanzwe)",
        "Umuti wishe udukoko ushingiye kuri Spinosad",
        "Imidacloprid ku kwanduza gukabije",
      ],
      timing: "Apply at first sign of mines, repeat every 7-10 days",
      timingRw: "Shyira igihe cyambere imyobo igaragaye, subiramo buri minsi 7-10",
      cost: "3,000 - 5,000 RWF per treatment",
    },
  },
  {
    id: "cercospora",
    name: "Cercospora Leaf Spot",
    nameRw: "Amacunga ya Cercospora",
    scientificName: "Cercospora coffeicola",
    severity: "moderate",
    icon: Droplets,
    color: "bg-purple-500",
    description: "Cercospora leaf spot causes circular brown spots with grayish centers on coffee leaves. It thrives in wet conditions and can affect both leaves and coffee berries.",
    descriptionRw: "Amacunga ya Cercospora atera utubara tw'uruziga twa bruni dufite hagati hera ku mababi y'ikawa. Ikura cyane mu bihe by'umwuka mwiza kandi ishobora kwangiza amababi n'imbuto z'ikawa.",
    symptoms: [
      "Circular spots with brown edges and gray centers",
      "Spots may have yellow halos",
      "Affected areas become dry and papery",
      "In severe cases, spots merge causing large dead areas",
      "Can also appear on coffee berries",
    ],
    symptomsRw: [
      "Utubara tw'uruziga dufite impande za bruni na hagati hera",
      "Utubara dushobora kugira uruziga rw'umuhondo",
      "Ahantu handujwe haba hyumye kandi hameze nk'urupapuro",
      "Mu bihe bikomeye, utubara turahuza tugatera ahantu hanini hapfuye",
      "Bishobora no kugaragara ku mbuto z'ikawa",
    ],
    prevention: [
      "Improve air circulation through proper pruning",
      "Avoid overhead irrigation that wets leaves",
      "Provide adequate shade in hot climates",
      "Remove and destroy infected plant debris",
      "Apply balanced fertilization",
    ],
    preventionRw: [
      "Kunoza umuyaga ubinyujije mu gukata neza",
      "Irinde kuvomera hejuru bituma amababi aba anyonje",
      "Tanga igitutu gihagije mu turere dushyushye",
      "Kuraho no gutwika ibisigazwa by'ibimera byandujwe",
      "Shyira ifumbire yuzuye",
    ],
    treatment: {
      action: "Apply copper-based or systemic fungicide",
      actionRw: "Shyira umuti wa fungicide ushingiye ku muringa cyangwa sistemu",
      products: [
        "Copper oxychloride (3g/L water)",
        "Mancozeb fungicide",
        "Propiconazole for systemic protection",
      ],
      productsRw: [
        "Copper oxychloride (3g/L amazi)",
        "Umuti wa fungicide Mancozeb",
        "Propiconazole ku kurinda sisitemu",
      ],
      timing: "Apply preventively before wet season, repeat every 21 days",
      timingRw: "Shyira mbere y'igihe cy'imvura, subiramo buri minsi 21",
      cost: "2,000 - 3,500 RWF per treatment",
    },
  },
];

const DiseasesPage = () => {
  const { language, t } = useLanguage();

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-500 text-white">High Risk</Badge>;
      case "moderate":
        return <Badge className="bg-yellow-500 text-white">Moderate Risk</Badge>;
      case "none":
        return <Badge className="bg-green-500 text-white">Healthy</Badge>;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen px-4 py-12 pt-20 bg-gradient-to-b from-[#1a0f0a] via-[#2d1810] to-[#1a0f0a]">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-green-600/20 border border-green-500/30 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                {language === "rw" ? "Indwara z'Ikawa" : "Coffee Diseases"}
              </h1>
              <p className="text-white/60">
                {language === "rw" 
                  ? "Menya indwara z'ikawa, ibimenyetso, n'uburyo bwo kuzivura" 
                  : "Learn about coffee diseases, symptoms, and treatments"}
              </p>
            </div>
          </div>
        </div>

        {/* Disease Cards */}
        <div className="space-y-6">
          {diseases.map((disease, index) => (
            <Card 
              key={disease.id} 
              className="border-0 shadow-xl overflow-hidden animate-slide-up bg-white/5 backdrop-blur-md border border-white/10"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className={`${disease.color} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <disease.icon className="h-8 w-8" />
                    <div>
                      <CardTitle className="text-2xl">
                        {language === "rw" ? disease.nameRw : disease.name}
                      </CardTitle>
                      {disease.scientificName !== "N/A" && (
                        <p className="text-sm opacity-90 italic">{disease.scientificName}</p>
                      )}
                    </div>
                  </div>
                  {getSeverityBadge(disease.severity)}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Description */}
                <p className="text-white/70 mb-6">
                  {language === "rw" ? disease.descriptionRw : disease.description}
                </p>

                <Accordion type="single" collapsible className="w-full">
                  {/* Symptoms */}
                  <AccordionItem value="symptoms" className="border-white/10">
                    <AccordionTrigger className="text-lg font-semibold text-white hover:text-white/80">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-500" />
                        {language === "rw" ? "Ibimenyetso" : "Symptoms"}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 pl-4">
                        {(language === "rw" ? disease.symptomsRw : disease.symptoms).map((symptom, i) => (
                          <li key={i} className="flex items-start gap-2 text-white/70">
                            <span className="inline-block h-2 w-2 rounded-full bg-green-500 mt-2" />
                            <span>{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Prevention */}
                  <AccordionItem value="prevention" className="border-white/10">
                    <AccordionTrigger className="text-lg font-semibold text-white hover:text-white/80">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-400" />
                        {language === "rw" ? "Uburyo bwo Kwirinda" : "Prevention"}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 pl-4">
                        {(language === "rw" ? disease.preventionRw : disease.prevention).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-white/70">
                            <span className="inline-block h-2 w-2 rounded-full bg-blue-400 mt-2" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Treatment */}
                  {disease.treatment && (
                    <AccordionItem value="treatment" className="border-white/10">
                      <AccordionTrigger className="text-lg font-semibold text-white hover:text-white/80">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-5 w-5 text-amber-400" />
                          {language === "rw" ? "Ubuvuzi" : "Treatment"}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {/* Action */}
                          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                            <p className="font-semibold text-blue-400 mb-1">
                              {language === "rw" ? "Igikorwa" : "Action"}
                            </p>
                            <p className="text-blue-300">
                              {language === "rw" ? disease.treatment.actionRw : disease.treatment.action}
                            </p>
                          </div>

                          {/* Products */}
                          <div>
                            <p className="font-semibold mb-2 text-white">
                              {language === "rw" ? "Ibikoresho" : "Recommended Products"}:
                            </p>
                            <ul className="space-y-1 pl-4">
                              {(language === "rw" ? disease.treatment.productsRw : disease.treatment.products).map((product, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 mt-2" />
                                  <span>{product}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Timing */}
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <span className="font-medium text-white">
                              {language === "rw" ? "Igihe:" : "Timing:"}
                            </span>
                            {language === "rw" ? disease.treatment.timingRw : disease.treatment.timing}
                          </div>

                          {/* Cost */}
                          <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                            <p className="text-sm text-green-400 font-medium">
                              {language === "rw" ? "Igiciro Giteganijwe" : "Estimated Cost"}
                            </p>
                            <p className="text-lg font-bold text-green-400">{disease.treatment.cost}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-400 mb-1">
                {language === "rw" ? "Icyitonderwa" : "Disclaimer"}
              </p>
              <p className="text-sm text-yellow-300/80">
                {language === "rw" 
                  ? "Iyi myirondoro itangwa kugira ngo uyikoreshe gusa. Ku bibazo bikomeye cyangwa kutizerana, banza ubaze umujyanama w'ubuhinzi wa RAB mu karere kawe." 
                  : "This information is provided for guidance only. For severe cases or uncertainty, please consult with a RAB agricultural extension officer in your area."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DiseasesPage;
