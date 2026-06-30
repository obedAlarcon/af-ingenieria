<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';
require_once __DIR__ . '/config.php';
// =========================================
// SOLO PERMITIR MÉTODO POST
// =========================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Método no permitido.');
}

// =========================================
// RECIBIR DATOS
// =========================================

$name     = trim($_POST['name'] ?? '');
$company  = trim($_POST['company'] ?? '');
$phone    = trim($_POST['phone'] ?? '');
$email    = trim($_POST['email'] ?? '');
$service  = trim($_POST['service'] ?? '');
$message  = trim($_POST['message'] ?? '');

// =========================================
// VALIDACIONES
// =========================================

if (
    empty($name) ||
    empty($phone) ||
    empty($email) ||
    empty($service) ||
    empty($message)
) {
    exit('Debe completar todos los campos obligatorios.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    exit('El correo electrónico no es válido.');
}

// =========================================
// LIMPIAR DATOS
// =========================================

$name     = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$company  = htmlspecialchars($company, ENT_QUOTES, 'UTF-8');
$phone    = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$email    = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$service  = htmlspecialchars($service, ENT_QUOTES, 'UTF-8');
$message  = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

// =========================================
// PHPMailer
// =========================================

$mail = new PHPMailer(true);

try {

    // =====================================
    // CONFIGURACIÓN SMTP
    // =====================================

    $mail->isSMTP();
   $mail->Host = SMTP_HOST;
$mail->SMTPAuth = true;

$mail->Username = SMTP_USERNAME;
$mail->Password = SMTP_PASSWORD;

$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port = SMTP_PORT;

$mail->setFrom(
    SMTP_USERNAME,
    SMTP_FROM_NAME
);

$mail->addAddress(
    SMTP_USERNAME,
    SMTP_FROM_NAME
);

    // =====================================
    // RESPONDER AL CLIENTE
    // =====================================

    $mail->addReplyTo($email, $name);

    // =====================================
    // FORMATO
    // =====================================

    $mail->CharSet = 'UTF-8';
    $mail->isHTML(true);

    $mail->Subject = 'Nueva solicitud de contacto - AF Ingeniería';

    $mail->Body = "
    <div style='font-family:Arial,sans-serif;font-size:15px;color:#333;'>

        <h2 style='color:#0056b3;'>
            Nueva solicitud desde el sitio web
        </h2>

        <hr>

        <table cellpadding='8' cellspacing='0' width='100%'>

            <tr>
                <td><strong>Nombre:</strong></td>
                <td>{$name}</td>
            </tr>

            <tr>
                <td><strong>Empresa:</strong></td>
                <td>{$company}</td>
            </tr>

            <tr>
                <td><strong>Teléfono:</strong></td>
                <td>{$phone}</td>
            </tr>

            <tr>
                <td><strong>Correo:</strong></td>
                <td>{$email}</td>
            </tr>

            <tr>
                <td><strong>Servicio:</strong></td>
                <td>{$service}</td>
            </tr>

        </table>

        <hr>

        <h3>Mensaje o requerimiento</h3>

        <p>{$message}</p>

        <hr>

        <small>
            Este correo fue enviado automáticamente desde el formulario
            de contacto del sitio web de AF Ingeniería.
        </small>

    </div>
    ";

    $mail->AltBody =
"Nombre: {$name}

Empresa: {$company}

Teléfono: {$phone}

Correo: {$email}

Servicio: {$service}

Mensaje:

{$message}";

    $mail->send();

    echo "OK";

} catch (Exception $e) {

    http_response_code(500);

    echo "No fue posible enviar el correo. " . $mail->ErrorInfo;

}