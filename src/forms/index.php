<?php

require(__DIR__ . "/../../vendor/autoload.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class SendMail {

    protected $body;
    protected $formFields = [];
    protected $recaptchaVerified = false;

    /**
     * SendMail constructor.
     * Loads env variables
     * gets form fields from $_GET or $_POST
     * sends email containing form submission results
     */
    function __construct()
    {
        $dotenv = new Dotenv\Dotenv(__DIR__.'/../../');
        $dotenv->load();
        $recaptchaSecret = getenv('RECAPTCHA_SECRET');

        if (!isset($recaptchaSecret))
            throw new Exception('recaptcha secret not found');

        $this->verifyRecaptcha($recaptchaSecret);

        if ($this->recaptchaVerified) {
            $this->getFormFields();

            if (!empty($this->formFields)) {
                $this->wrapBody();
                $this->sendMail();
            }
        }
    }

    /**
     * Verify the recaptcha response with google
     */
    public function verifyRecaptcha($secret) {
        $recaptcha = new ReCaptcha\ReCaptcha($secret);

        $resp = $recaptcha->verify($_POST['recaptchaToken'], $_SERVER['SERVER_ADDR']);
        if ($resp->isSuccess()) {
            $this->recaptchaVerified = true;

        } else {
            $errors = $resp->getErrorCodes();
        }
    }

    /**
     * Collects form fields and values from get and post
     */
    public function getFormFields()
    {
        foreach ($_POST as $key => $item) {
            if ($item) {
                $this->formFields[$key] = $item;
            } else {
                continue;
            }
        }
    }

    /**
     * wraps the email fields within an email template string
     */
    public function wrapBody()
    {
        $this->body = "Message from: " . $this->formFields['name'] . 
            '<br/> <br/>Email address: ' . $this->formFields['email'] . 
            '<br/> <br/>Message: ' . $this->formFields['message'] .
            '<br/> <br/>Sent using BTM automailer';
    }

    /**
     * Sends email
     * Collects to and from address from .env
     */
    public function sendMail()
    {
        $mail = new PHPMailer(true);                              // Passing `true` enables exceptions
        $recipient = getenv('FROM_EMAIL');
        $sender = getenv('RECIPIENT_EMAIL');

        if(!isset($recipient))
            throw new Exception('Recipient email address not found');

        if(!isset($sender))
            throw new Exception('Sender email address not found');

        try {
            //Server settings
            $mail->SMTPDebug = 0;                                 // Enable verbose debug output
            $mail->isSMTP();                                      // Set mailer to use SMTP

            //Recipients
            $mail->setFrom(getenv('FROM_EMAIL'), 'nuxt-website@nuxt.com');
            $mail->addAddress(getenv('RECIPIENT_EMAIL'), 'nuxt-website@nuxt.com');     // Add a recipient

            //Content
            $mail->isHTML(true);                                  // Set email format to HTML
            $mail->Subject = $this->formFields['subject'];
            $mail->Body    = $this->body;
            $mail->AltBody = str_replace("<br />", "\r\n", $this->body);

            $port = getenv('SMTP_PORT');
            if (isset($port)) {
                $mail->Port = $port;
            }

            $mail->send();

            $data = [
                'success' => true
            ];
            header('Content-Type: application/json');
            echo json_encode($data);
        } catch (Exception $e) {
            $data = [
                'success' => false,
                'info' => $mail->ErrorInfo
            ];
            header('Content-Type: application/json');
            echo json_encode($data);
        }
    }

}

new SendMail();
