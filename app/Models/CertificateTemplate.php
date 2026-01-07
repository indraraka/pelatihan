<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class CertificateTemplate extends Model
{
    protected $fillable = [
        'name',
        'template_type',
        'html_template',
        'text_elements',
        'editor_config',
        'background_image',
        'signer_name',
        'signer_title',
        'signature_image',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'text_elements' => 'array',
        'editor_config' => 'array',
    ];

    public function trainings(): HasMany
    {
        return $this->hasMany(Training::class);
    }

    /**
     * Render the certificate with given data
     */
    public function render(array $data): string
    {
        if ($this->template_type === 'image') {
            return $this->renderImageTemplate($data);
        }

        return $this->renderHtmlTemplate($data);
    }

    /**
     * Render HTML-based template
     */
    protected function renderHtmlTemplate(array $data): string
    {
        $html = $this->html_template;
        
        foreach ($data as $key => $value) {
            $html = str_replace('{{' . $key . '}}', $value, $html);
        }
        
        // Add signer info
        $html = str_replace('{{signer_name}}', $this->signer_name ?? '', $html);
        $html = str_replace('{{signer_title}}', $this->signer_title ?? '', $html);
        
        return $html;
    }

    /**
     * Render image-based template with positioned text elements
     */
    protected function renderImageTemplate(array $data): string
    {
        $backgroundUrl = $this->background_image 
            ? Storage::url($this->background_image)
            : '';
        
        $elements = $this->text_elements ?? [];
        $elementsHtml = '';
        
        foreach ($elements as $element) {
            $value = $element['value'] ?? '';
            
            // Replace placeholders
            foreach ($data as $key => $val) {
                $value = str_replace('{{' . $key . '}}', $val, $value);
            }
            $value = str_replace('{{signer_name}}', $this->signer_name ?? '', $value);
            $value = str_replace('{{signer_title}}', $this->signer_title ?? '', $value);
            
            $styles = $this->buildElementStyles($element);
            $elementsHtml .= "<div style=\"{$styles}\">{$value}</div>\n";
        }

        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <style>
        @page {
            margin: 0;
            size: A4 landscape;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            margin: 0;
            padding: 0;
            width: 297mm;
            height: 210mm;
            position: relative;
        }
        .certificate-container {
            position: relative;
            width: 100%;
            height: 100%;
            background-image: url('{$backgroundUrl}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        {$elementsHtml}
    </div>
</body>
</html>
HTML;
    }

    /**
     * Build CSS styles for a text element
     */
    protected function buildElementStyles(array $element): string
    {
        $x = $element['x'] ?? 50;
        $y = $element['y'] ?? 50;
        $fontSize = $element['fontSize'] ?? 24;
        $fontFamily = $element['fontFamily'] ?? 'Times New Roman, serif';
        $fontWeight = $element['fontWeight'] ?? 'normal';
        $color = $element['color'] ?? '#000000';
        $textAlign = $element['textAlign'] ?? 'center';
        $width = $element['width'] ?? 100;
        
        return implode('; ', [
            'position: absolute',
            "left: {$x}%",
            "top: {$y}%",
            'transform: translate(-50%, -50%)',
            "width: {$width}%",
            "font-size: {$fontSize}px",
            "font-family: {$fontFamily}",
            "font-weight: {$fontWeight}",
            "color: {$color}",
            "text-align: {$textAlign}",
            'white-space: nowrap',
        ]);
    }

    /**
     * Get available placeholders
     */
    public static function getPlaceholders(): array
    {
        return [
            ['key' => '{{name}}', 'label' => 'Participant Name'],
            ['key' => '{{organization}}', 'label' => 'Organization'],
            ['key' => '{{training_title}}', 'label' => 'Training Title'],
            ['key' => '{{training_date}}', 'label' => 'Training Date'],
            ['key' => '{{training_duration}}', 'label' => 'Training Duration'],
            ['key' => '{{certificate_number}}', 'label' => 'Certificate Number'],
            ['key' => '{{issue_date}}', 'label' => 'Issue Date'],
            ['key' => '{{signer_name}}', 'label' => 'Signer Name'],
            ['key' => '{{signer_title}}', 'label' => 'Signer Title'],
        ];
    }
}
