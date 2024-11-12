import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface AlertComponentProps {
  variant: string;
  alertTitle: string;
  errorMessage: string;
}

export function AlertComponent(props: AlertComponentProps) {
  console.log(props.variant);
  console.log(props.alertTitle);
  console.log(props.errorMessage);

  return (
    <Alert variant={props.variant}>
      <ExclamationTriangleIcon className='h-4 w-4' />
      <AlertTitle>{props.alertTitle}</AlertTitle>
      <AlertDescription>{props.errorMessage}</AlertDescription>
    </Alert>
  );
}
