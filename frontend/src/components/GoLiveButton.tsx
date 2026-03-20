import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Rocket, CheckCircle2, ExternalLink } from 'lucide-react';
import { usePublishSite, useGetSitePublicationStatus } from '../hooks/useQueries';
import { Badge } from '@/components/ui/badge';

export default function GoLiveButton() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { data: publicationStatus, isLoading: statusLoading } = useGetSitePublicationStatus();
  const { mutate: publishSite, isPending } = usePublishSite();

  const handlePublish = () => {
    publishSite(undefined, {
      onSuccess: () => {
        setShowConfirmDialog(false);
        setShowSuccessDialog(true);
      },
    });
  };

  if (statusLoading) {
    return null;
  }

  const isLive = publicationStatus?.isLive;

  return (
    <>
      <div className="flex items-center gap-2">
        {isLive && (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Live
          </Badge>
        )}
        <Button
          onClick={() => setShowConfirmDialog(true)}
          disabled={isPending}
          variant={isLive ? 'outline' : 'default'}
          className="rounded-full font-semibold shadow-playful hover:shadow-playful-lg transition-all duration-200 hover:scale-105"
          size="lg"
        >
          <Rocket className="h-4 w-4 mr-2" />
          {isLive ? 'Republicare' : 'Go Live'}
        </Button>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl flex items-center gap-2">
              <Rocket className="h-6 w-6 text-primary" />
              {isLive ? 'Republicare site' : 'Publicare site'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base space-y-3 pt-2">
              <p>
                {isLive
                  ? 'Sunteți pe cale să republicați site-ul cu ultimele modificări.'
                  : 'Sunteți pe cale să publicați site-ul BOB Land și să-l faceți accesibil publicului.'}
              </p>
              <p className="font-semibold text-foreground">
                Site-ul va fi disponibil la adresa: <br />
                <span className="text-primary">{publicationStatus?.publicUrl}</span>
              </p>
              <p className="text-sm">
                După publicare, puteți continua să editați conținutul. Modificările vor fi vizibile imediat.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Anulare</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublish}
              disabled={isPending}
              className="rounded-full bg-primary hover:bg-primary/90"
            >
              {isPending ? 'Se publică...' : isLive ? 'Republicare' : 'Publicare'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
              Site publicat cu succes!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base space-y-4 pt-2">
              <p className="text-foreground">
                Site-ul BOB Land este acum live și accesibil publicului la adresa:
              </p>
              <a
                href={publicationStatus?.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-lg transition-colors"
              >
                {publicationStatus?.publicUrl}
                <ExternalLink className="h-4 w-4" />
              </a>
              <div className="bg-muted p-4 rounded-2xl space-y-2">
                <p className="font-semibold text-foreground">Ce urmează?</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Puteți continua să editați meniul, galeriile și alte conținuturi</li>
                  <li>Modificările vor fi vizibile imediat pe site-ul live</li>
                  <li>Clienții pot acum să plaseze precomenzi și să lase recenzii</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowSuccessDialog(false)}
              className="rounded-full bg-primary hover:bg-primary/90"
            >
              Înțeles
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
