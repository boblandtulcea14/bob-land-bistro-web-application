import { useState, useEffect } from 'react';
import {
  useGetDomainValidationContent,
  useSetDomainValidationContent,
  useGetSitePublicationStatus,
  useGetICPDomainAndValidationToken,
} from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Save,
  Copy,
  CheckCircle2,
  Globe,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  CheckCheck,
  Clock,
  RefreshCw,
  XCircle,
  Link2,
} from 'lucide-react';
import { toast } from 'sonner';

type DomainCheckStatus = 'idle' | 'checking' | 'ok' | 'error';

export default function DomainValidationManagement() {
  const { data: validationContent, isLoading } = useGetDomainValidationContent();
  const { data: siteStatus } = useGetSitePublicationStatus();
  const { data: icpData, isLoading: icpLoading } = useGetICPDomainAndValidationToken();
  const { mutate: setValidationContent, isPending } = useSetDomainValidationContent();

  const [content, setContent] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedCname, setCopiedCname] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [domainCheckStatus, setDomainCheckStatus] = useState<DomainCheckStatus>('idle');
  const [domainCheckMessage, setDomainCheckMessage] = useState('');

  useEffect(() => {
    if (validationContent !== undefined) {
      setContent(validationContent);
    }
  }, [validationContent]);

  const handleSave = () => {
    setValidationContent(content);
  };

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/.well-known/ic-domains`;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    toast.success('URL copiat în clipboard!');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Conținut copiat în clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCname = () => {
    const cnameTarget = icpData?.icpDomain || siteStatus?.publicUrl || 'bob-land.icp0.io';
    // Strip https:// for CNAME value
    const cnameValue = cnameTarget.replace(/^https?:\/\//, '');
    navigator.clipboard.writeText(cnameValue);
    setCopiedCname(true);
    toast.success('Valoarea CNAME copiată în clipboard!');
    setTimeout(() => setCopiedCname(false), 2000);
  };

  const handleCopyToken = () => {
    const token = icpData?.validationToken || '';
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    toast.success('Token de validare copiat în clipboard!');
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleCheckDomain = async () => {
    if (!customDomain.trim()) {
      toast.error('Introdu mai întâi domeniul personalizat pe care vrei să-l verifici.');
      return;
    }
    setDomainCheckStatus('checking');
    setDomainCheckMessage('');
    try {
      const domain = customDomain.trim().replace(/^https?:\/\//, '');
      const url = `https://${domain}/.well-known/ic-domains`;
      const response = await fetch(url, { method: 'GET', mode: 'no-cors' });
      // no-cors means we can't read the body, but if it doesn't throw, the server responded
      setDomainCheckStatus('ok');
      setDomainCheckMessage(`Domeniul ${domain} pare să fie accesibil. Verifică manual că fișierul /.well-known/ic-domains returnează tokenul corect.`);
    } catch {
      setDomainCheckStatus('error');
      setDomainCheckMessage(`Nu s-a putut contacta domeniul. Verifică că DNS-ul s-a propagat și că CNAME-ul este configurat corect.`);
    }
  };

  if (isLoading || icpLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const validationUrl = `${window.location.origin}/.well-known/ic-domains`;
  const rawIcpDomain = icpData?.icpDomain || siteStatus?.publicUrl || 'https://bob-land.icp0.io';
  const cnameTarget = rawIcpDomain.replace(/^https?:\/\//, '');
  const validationToken = icpData?.validationToken || 'bkyz2-fmaaa-aaaaa-qaaaq-cai';
  const hasValidationContent = content.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Status Domeniu Personalizat
          </CardTitle>
          <CardDescription>
            Configurează domeniul tău personalizat (ex: <strong>www.bob-land.xyz</strong>) pentru a-l conecta la aplicație.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Fișier validare ICP:</span>
            <Badge variant={hasValidationContent ? 'default' : 'secondary'}>
              {hasValidationContent ? (
                <>
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Configurat
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3 mr-1" />
                  Neconfigurat
                </>
              )}
            </Badge>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm font-medium">Adresa ICP publică:</span>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded">{rawIcpDomain}</code>
              <a
                href={rawIcpDomain}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm font-medium">Token validare (Canister ID):</span>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{validationToken}</code>
              <Button variant="ghost" size="sm" onClick={handleCopyToken} className="h-7 w-7 p-0">
                {copiedToken ? <CheckCircle2 className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step-by-Step Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Ghid Pas cu Pas — Configurare DNS Personalizat
          </CardTitle>
          <CardDescription>
            Urmează acești pași pentru a conecta domeniul tău (ex: <strong>www.bob-land.xyz</strong>) la aplicație
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={['step-1', 'step-2', 'step-3']} className="w-full">

            {/* Step 1 — CNAME */}
            <AccordionItem value="step-1">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold">1</Badge>
                  <span className="font-semibold">Adaugă înregistrarea CNAME în GoDaddy</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Ce trebuie să faci în GoDaddy</AlertTitle>
                  <AlertDescription>
                    Intră în contul GoDaddy → <strong>My Products</strong> → <strong>DNS</strong> lângă domeniul tău → <strong>Add New Record</strong>
                  </AlertDescription>
                </Alert>

                <div className="bg-muted rounded-lg p-4 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Completează exact aceste valori:</p>

                  <div className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-4 text-sm items-center">
                    <span className="font-medium text-muted-foreground">Type:</span>
                    <code className="bg-background px-2 py-1 rounded font-mono text-xs">CNAME</code>

                    <Separator className="col-span-2" />

                    <span className="font-medium text-muted-foreground">Name / Host:</span>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-background px-2 py-1 rounded font-mono text-xs">www</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 shrink-0"
                        onClick={() => { navigator.clipboard.writeText('www'); toast.success('Copiat!'); }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                    <Separator className="col-span-2" />

                    <span className="font-medium text-muted-foreground">Value / Points to:</span>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-background px-2 py-1 rounded font-mono text-xs break-all">{cnameTarget}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 shrink-0"
                        onClick={handleCopyCname}
                      >
                        {copiedCname ? <CheckCircle2 className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>

                    <Separator className="col-span-2" />

                    <span className="font-medium text-muted-foreground">TTL:</span>
                    <code className="bg-background px-2 py-1 rounded font-mono text-xs">600</code>
                  </div>
                </div>

                <Alert>
                  <AlertDescription className="text-xs space-y-1">
                    <p><strong>⚠️ Eroarea din GoDaddy</strong> — Dacă primești eroarea <em>"Enter either @ or a valid host name"</em>, înseamnă că ai pus valoarea greșită în câmpul <strong>Name/Host</strong>. Pune <code className="bg-muted px-1 rounded">www</code> (nu <code className="bg-muted px-1 rounded">@</code> și nu adresa completă).</p>
                    <p><strong>⏳ Propagare DNS</strong> — Modificările pot dura 2–48 ore să se propage global.</p>
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            {/* Step 2 — ic-domains file */}
            <AccordionItem value="step-2">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold">2</Badge>
                  <span className="font-semibold">Fișierul <code className="text-xs font-mono">.well-known/ic-domains</code> — deja configurat ✅</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-700 dark:text-green-400">Fișierul este deja inclus în aplicație</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    Fișierul <code className="bg-green-100 dark:bg-green-900 px-1 rounded text-xs">/.well-known/ic-domains</code> este deja prezent în aplicația ta și conține tokenul de validare corect. Nu trebuie să faci nimic suplimentar pentru acest pas.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <p className="text-sm font-medium">Conținutul fișierului de validare:</p>
                  <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                    <code className="flex-1 font-mono text-sm break-all">{validationToken}</code>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={handleCopyToken}>
                      {copiedToken ? <CheckCircle2 className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Acesta este Canister ID-ul aplicației tale. ICP boundary nodes îl folosesc pentru a verifica că deții domeniul.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">URL-ul fișierului de validare:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-muted px-3 py-2 rounded text-xs break-all">{validationUrl}</code>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={handleCopyUrl}>
                      {copiedUrl ? <CheckCircle2 className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                    </Button>
                    <a href={validationUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Conținut validare personalizat (opțional):</p>
                  <div className="space-y-2">
                    <Label htmlFor="validation-content" className="text-xs text-muted-foreground">
                      Dacă ICP îți furnizează un token diferit, îl poți seta aici:
                    </Label>
                    <Textarea
                      id="validation-content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Token personalizat furnizat de Internet Computer..."
                      rows={3}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={isPending || content === validationContent}
                      size="sm"
                      className="rounded-full"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Se salvează...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Salvează token personalizat
                        </>
                      )}
                    </Button>
                    {hasValidationContent && (
                      <Button variant="outline" size="sm" onClick={handleCopyContent} className="rounded-full">
                        {copied ? (
                          <><CheckCircle2 className="mr-2 h-4 w-4" />Copiat</>
                        ) : (
                          <><Copy className="mr-2 h-4 w-4" />Copiază</>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Step 3 — Check domain */}
            <AccordionItem value="step-3">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold">3</Badge>
                  <span className="font-semibold">Verifică statusul domeniului personalizat</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  După ce ai configurat CNAME-ul și ai așteptat propagarea DNS, verifică dacă domeniul tău funcționează corect.
                </p>

                <div className="space-y-3">
                  <Label htmlFor="custom-domain">Domeniul tău personalizat</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="custom-domain"
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                        placeholder="www.bob-land.xyz"
                        className="pl-9 font-mono text-sm"
                      />
                    </div>
                    <Button
                      onClick={handleCheckDomain}
                      disabled={domainCheckStatus === 'checking'}
                      variant="outline"
                      className="rounded-full shrink-0"
                    >
                      {domainCheckStatus === 'checking' ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Se verifică...</>
                      ) : (
                        <><RefreshCw className="mr-2 h-4 w-4" />Verifică</>
                      )}
                    </Button>
                  </div>
                </div>

                {domainCheckStatus === 'ok' && (
                  <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-700 dark:text-green-400">Domeniu accesibil</AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-400 text-sm">
                      {domainCheckMessage}
                    </AlertDescription>
                  </Alert>
                )}

                {domainCheckStatus === 'error' && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Domeniu inaccesibil</AlertTitle>
                    <AlertDescription className="text-sm">
                      {domainCheckMessage}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium">Instrumente externe de verificare DNS:</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`https://dnschecker.org/#CNAME/${customDomain || 'www.bob-land.xyz'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="rounded-full text-xs">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        DNS Checker
                      </Button>
                    </a>
                    <a
                      href={`https://www.whatsmydns.net/#CNAME/${customDomain || 'www.bob-land.xyz'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="rounded-full text-xs">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        What's My DNS
                      </Button>
                    </a>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Step 4 — Troubleshooting */}
            <AccordionItem value="step-4">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    <HelpCircle className="h-4 w-4" />
                  </Badge>
                  <span className="font-semibold">Probleme comune și soluții</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      Eroarea "Enter either @ or a valid host name" în GoDaddy
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
                      <li>Câmpul <strong>Name/Host</strong> trebuie să conțină doar <code className="bg-muted px-1 rounded text-xs">www</code></li>
                      <li>Nu pune adresa completă (ex: <code className="bg-muted px-1 rounded text-xs">www.bob-land.xyz</code>) — doar <code className="bg-muted px-1 rounded text-xs">www</code></li>
                      <li>Nu pune <code className="bg-muted px-1 rounded text-xs">@</code> pentru CNAME — GoDaddy nu permite CNAME pe domeniul rădăcină</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      Domeniul nu se rezolvă / Site-ul nu se încarcă
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
                      <li>Verifică că ai introdus corect valoarea CNAME: <code className="bg-muted px-1 rounded text-xs">{cnameTarget}</code></li>
                      <li>Așteaptă mai mult timp pentru propagarea DNS (poate dura până la 48 ore)</li>
                      <li>Șterge cache-ul browserului (<kbd>Ctrl+Shift+R</kbd>) și încearcă din nou</li>
                      <li>Testează din modul incognito sau de pe alt dispozitiv</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      Eroare "Canister ID not resolved"
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
                      <li>Această eroare apare când fișierul <code className="bg-muted px-1 rounded text-xs">/.well-known/ic-domains</code> nu este accesibil sau nu conține Canister ID-ul corect</li>
                      <li>Canister ID-ul tău este: <code className="bg-muted px-1 rounded text-xs font-mono">{validationToken}</code></li>
                      <li>Fișierul este deja inclus în aplicație — redeploy-ează dacă problema persistă</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      Probleme specifice GoDaddy
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
                      <li>Asigură-te că ai dezactivat "Domain Forwarding" dacă este activ</li>
                      <li>Verifică că nu ai activat "Privacy Protection" care poate bloca CNAME-ul</li>
                      <li>Setează TTL la 600 (10 minute) pentru testare rapidă</li>
                      <li>Dacă există deja o înregistrare A pentru "www", șterge-o înainte de a adăuga CNAME</li>
                    </ul>
                  </div>
                </div>

                <Alert className="border-primary/50 bg-primary/5">
                  <HelpCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Rezumat rapid:</strong> Adaugă CNAME <code className="bg-muted px-1 rounded text-xs">www</code> → <code className="bg-muted px-1 rounded text-xs">{cnameTarget}</code> în GoDaddy, apoi așteaptă propagarea DNS. Fișierul de validare este deja configurat automat în aplicație.
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
