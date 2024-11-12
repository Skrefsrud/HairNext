import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  time_requirement: string;
}

interface Props {
  buttonContent: string;
  title: string;
  description: string;
  service: Service;
  onDeleteConfirmed: () => serviceId;
}

export function ComfirmServiceDelete(props: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='secondary'>{props.buttonContent}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          <AlertDialogDescription>{props.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => props.onDeleteConfirmed(props.service)}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
