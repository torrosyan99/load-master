<?php
declare(strict_types=1);

function respond(int $status, string $message): void
{
    http_response_code($status);
    header('Cache-Control: no-store');
    if (strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['message' => $message]);
    } else {
        header('Content-Type: text/plain; charset=UTF-8');
        echo $message;
    }
    exit;
}

function field(string $key): string
{
    $value = $_POST[$key] ?? '';
    return is_string($value) ? trim($value) : '';
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, 'Please use the contact form.');
}

$name = field('name');
$email = field('email');
$mobile = field('mobile');
$message = field('message');

if (!preg_match('/\A[^\x00-\x1F\x7F]{1,100}\z/u', $name) || !preg_match('/\S/u', $name)) {
    respond(422, 'Enter your name (up to 100 characters).');
}
if (strlen($email) > 254 || preg_match('/[\r\n]/', $email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, 'Enter a valid email address.');
}
$digits = preg_replace('/\D/', '', $mobile);
if (strlen($mobile) > 32 || !preg_match('/\A\+?[\d ().-]+\z/', $mobile) || !preg_match('/^\d{7,15}$/', $digits)) {
    respond(422, 'Enter a mobile number with 7 to 15 digits.');
}
$message = str_replace(["\r\n", "\r"], "\n", $message);
if (!preg_match('/\A.{1,4000}\z/su', $message) || !preg_match('/\S/u', $message) || strpos($message, "\0") !== false) {
    respond(422, 'Enter a message (up to 4000 characters).');
}

$mailbox = 'info@loadmasterg.com';
$body = "Name: $name\nEmail: $email\nMobile: $mobile\n\n$message";
$headers = [
    'From' => "LoadMaster <$mailbox>",
    'Reply-To' => $email,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => 'base64',
];

$sent = function_exists('mail') && @mail($mailbox, 'LoadMaster contact form', chunk_split(base64_encode($body)), $headers);
if (!$sent) {
    respond(503, 'Your message could not be sent. Please try again later.');
}
respond(200, 'Thank you. Your message has been submitted.');
