<?php
/**
 * CITECH Contact Form Handler
 * Version: 3.0
 *
 * Sicherheitsfeatures:
 * - CSRF-Schutz via Origin-Check
 * - Rate Limiting (3 Anfragen pro Stunde)
 * - Honeypot-Feld Pruefung
 * - Input-Sanitierung
 * - E-Mail-Validierung
 */

// ============================================
// KONFIGURATION
// ============================================
$config = [
    'email_schulung' => 'weiterbildung@citech-ai.de',
    'email_allgemein' => 'info@citech-ai.de',
    'from_email' => 'noreply@citech-ai.de',

    'allowed_origins' => [
        'https://citech-ai.de',
        'https://www.citech-ai.de',
        'http://citech-ai.de',
        'http://www.citech-ai.de',
    ],

    'max_submissions_per_hour' => 3,
    'debug' => false
];

// ============================================
// CORS & JSON Response Setup
// ============================================
header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $config['allowed_origins'])) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ============================================
// HILFSFUNKTIONEN
// ============================================

function sendResponse($success, $message = '', $code = 200) {
    http_response_code($code);
    echo json_encode([
        'success' => $success,
        'error' => $success ? null : $message,
        'message' => $success ? $message : null
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

function sanitizeInput($input, $maxLength = 1000) {
    if (empty($input)) return '';
    $input = trim($input);
    $input = strip_tags($input);
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    return mb_substr($input, 0, $maxLength);
}

function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function logDebug($message, $config) {
    if ($config['debug']) {
        error_log('[CITECH Contact] ' . $message);
    }
}

// ============================================
// SICHERHEITSPRUEFUNGEN
// ============================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method not allowed', 405);
}

if (!empty($origin) && !in_array($origin, $config['allowed_origins'])) {
    logDebug("Blocked: Invalid origin - $origin", $config);
    sendResponse(false, 'Forbidden', 403);
}

// ============================================
// RATE LIMITING
// ============================================
session_start();

$rate_key = 'contact_rate_limit';
$current_time = time();
$time_window = 3600;

if (!isset($_SESSION[$rate_key])) {
    $_SESSION[$rate_key] = ['count' => 0, 'window_start' => $current_time];
}

if ($current_time - $_SESSION[$rate_key]['window_start'] > $time_window) {
    $_SESSION[$rate_key] = ['count' => 0, 'window_start' => $current_time];
}

if ($_SESSION[$rate_key]['count'] >= $config['max_submissions_per_hour']) {
    sendResponse(false, 'Zu viele Anfragen. Bitte versuchen Sie es spaeter erneut.', 429);
}

// ============================================
// HONEYPOT (Bot-Schutz)
// ============================================
$honeypot = $_POST['website'] ?? '';
if (!empty($honeypot)) {
    sendResponse(true, 'Nachricht gesendet');
}

// ============================================
// FORMULARDATEN VERARBEITEN
// ============================================

$name = sanitizeInput($_POST['name'] ?? '', 100);
$email = sanitizeInput($_POST['email'] ?? '', 254);
$phone = sanitizeInput($_POST['phone'] ?? '', 30);
$interest = sanitizeInput($_POST['interest'] ?? '', 100);
$message = sanitizeInput($_POST['message'] ?? '', 5000);
$privacy = isset($_POST['privacy']) && ($_POST['privacy'] === 'on' || $_POST['privacy'] === 'true' || $_POST['privacy'] === '1');

// Pflichtfelder
if (empty($name)) {
    sendResponse(false, 'Bitte geben Sie Ihren Namen ein.', 400);
}
if (empty($email) || !isValidEmail($email)) {
    sendResponse(false, 'Bitte geben Sie eine gueltige E-Mail-Adresse ein.', 400);
}
if (!$privacy) {
    sendResponse(false, 'Bitte akzeptieren Sie die Datenschutzerklaerung.', 400);
}

// ============================================
// E-MAIL ERSTELLEN UND SENDEN
// ============================================

// Empfaenger basierend auf Interesse
$schulung_interessen = ['komplett', 'modul-1', 'modul-2', 'modul-3', 'modul-4', 'inhouse'];
if (in_array($interest, $schulung_interessen)) {
    $recipient_email = $config['email_schulung'];
} else {
    $recipient_email = $config['email_allgemein'];
}

// Betreff
$interest_labels = [
    'komplett' => 'Alle Module (Komplettpaket)',
    'modul-1' => 'Modul 1: KI-Anwender',
    'modul-2' => 'Modul 2: KI-Spezialist',
    'modul-3' => 'Modul 3: KI-Projektleiter',
    'modul-4' => 'Modul 4: KI-Manager',
    'regeltreue' => 'Regeltreue-Beratung',
    'tools' => 'Tool-Entwicklung',
    'inhouse' => 'Inhouse-Schulung',
    'sonstiges' => 'Sonstiges'
];
$interest_label = $interest_labels[$interest] ?? $interest;
$subject_text = !empty($interest) ? "Anfrage: $interest_label" : 'Kontaktanfrage';
$subject = "=?UTF-8?B?" . base64_encode("[CITECH] $subject_text") . "?=";

// Body
$email_body = "Neue Kontaktanfrage ueber die CITECH Website\n";
$email_body .= "==========================================\n\n";

$email_body .= "KONTAKTDATEN\n";
$email_body .= "------------\n";
$email_body .= "Name: $name\n";
$email_body .= "E-Mail: $email\n";
if (!empty($phone)) $email_body .= "Telefon: $phone\n";

$email_body .= "\nANFRAGE-DETAILS\n";
$email_body .= "---------------\n";
if (!empty($interest)) $email_body .= "Interesse: $interest_label\n";

$email_body .= "\nNACHRICHT\n";
$email_body .= "---------\n";
$email_body .= !empty($message) ? $message : '(Keine Nachricht eingegeben)';

$email_body .= "\n\n==========================================\n";
$email_body .= "Gesendet am: " . date('d.m.Y H:i:s') . "\n";
$email_body .= "IP-Adresse: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unbekannt') . "\n";

// Header
$headers = [];
$headers[] = "From: CITECH Website <{$config['from_email']}>";
$headers[] = "Reply-To: $name <$email>";
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headers[] = "X-Mailer: CITECH Contact Form v3";

// Senden
$mail_sent = mail($recipient_email, $subject, $email_body, implode("\r\n", $headers));

if ($mail_sent) {
    $_SESSION[$rate_key]['count']++;
    logDebug("Success: Mail sent to $recipient_email from $email", $config);
    sendResponse(true, 'Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns zeitnah bei Ihnen.');
} else {
    logDebug("Error: Mail sending failed for $email", $config);
    sendResponse(false, 'Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es spaeter erneut.', 500);
}
