import 'izitoast/dist/css/iziToast.min.css'
import iziToast from 'izitoast'

const toast = {
    error: (message, title = 'Fehler') => {
        return iziToast.error({
            title: title,
            message: message,
            position: 'bottomLeft',
            timeout: false,
        });
    },
    success: (message, title = 'Success') => {
        return iziToast.success({
            title: title,
            message: message,
            position: 'bottomLeft'
        });
    },
    apiError: (error, title = 'Fehler') => {

        if (error.response) {

            if (error.response.data.message) {
                console.log("Received response error message: " + error.response.data.message);
                toast.error(error.response.data.message, title);
            } else {
                toast.error("GitHub-API responded with an error", title);
            }
        } else if (error.request) {
            toast.error("Failed request", title);
        } else {
            console.log("" + error.message);
            toast.error(error.message);
        }
    }
}

export default toast;