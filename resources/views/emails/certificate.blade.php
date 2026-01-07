<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Your Training Certificate</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
        }
        .footer {
            background: #1f2937;
            color: #9ca3af;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            border-radius: 0 0 10px 10px;
        }
        .highlight {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
        }
        h1 { margin: 0; font-size: 24px; }
        h2 { color: #667eea; margin-top: 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Congratulations!</h1>
        <p>You have successfully completed your training</p>
    </div>
    
    <div class="content">
        <p>Dear <strong>{{ $attendance->name }}</strong>,</p>
        
        <p>Thank you for attending our training session. We are pleased to confirm your successful participation.</p>
        
        <div class="highlight">
            <h2>{{ $training->title }}</h2>
            <p><strong>Date:</strong> {{ $training->start_time->format('d F Y') }}</p>
            <p><strong>Time:</strong> {{ $training->start_time->format('H:i') }} - {{ $training->end_time->format('H:i') }}</p>
            <p><strong>Certificate Number:</strong> {{ $attendance->certificate_number }}</p>
        </div>
        
        <p>Your certificate is attached to this email. Please keep it for your records.</p>
        
        <p>Best regards,<br>Training Management Team</p>
    </div>
    
    <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>&copy; {{ date('Y') }} Training Management System</p>
    </div>
</body>
</html>
