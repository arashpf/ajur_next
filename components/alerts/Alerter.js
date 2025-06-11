import React, {useEffect, useState} from 'react';
    import Snackbar from '@mui/material/Snackbar';
    import MuiAlert from '@mui/material/Alert';
    import { useRouter } from 'next/router';
    const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={20} ref={ref} variant="filled" {...props} />;
    });
  
    const Alerter = (props) => {
    

  
    const [open, setOpen] = React.useState(false);
    const [problem, setProblem] = useState('username_test_problem');
    const [vertical, set_vertical] = useState('top');
    const [horizontal, set_horizontal] = useState('center');
    const [alert_type, set_alert_type] = useState('success');

    


    
    function handleClose(){
        setOpen(false);
        console.log('close snack is cliked'); 
      }

   function changeStatus() {
     // The parent component can call this function.
    console.log('change status trigered ');
    setOpen(!open);
   }

   function onButtonClick() {
    // Call the parent function.
    props.biRef.someParentFunction();
 }

 props.biRef.changeStatus = changeStatus;

  return (
        <>
        
        <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} autoHideDuration={10000} onClose={handleClose}>
            <Alert onClose={handleClose} 
            severity= {alert_type}
            sx={{ width: '100%' }}>
            {problem}
            </Alert>
        </Snackbar>
        </>
  )
};

export default Alerter;
