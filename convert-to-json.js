const fs = require('fs');
const path = require('path');

// الملفات اللي بدنا نحولها
const files = ['books.ts', 'cart.ts', 'reviews.ts'];

files.forEach(file => {
  try {
    const tsPath = path.join(__dirname, 'src/app/data', file);
    const jsonPath = tsPath.replace('.ts', '.json');

    // اقرأ محتوى الملف
    const data = fs.readFileSync(tsPath, 'utf8');

    // استخرج المصفوفة [ ... ] (ابحث عن = [ لنتجنب Book[] = [)
    const match = data.match(/=\s*\[[\s\S]*\]/);
    if (!match) {
      console.error(`❌ ما لقيت بيانات في ${file}`);
      return;
    }

    // استخرج فقط المصفوفة بدون "= "
    let json = match[0].replace(/^=\s*/, '');

    // احذف التعليقات (سطر واحد ومتعددة الأسطر)
    json = json.replace(/\/\/.*$/gm, '');
    json = json.replace(/\/\*[\s\S]*?\*\//g, '');

    // احمي الـ escaped single quotes (مثل Earth\'s, Maxwell\'s)
    json = json.replace(/\\'/g, '__ESCAPED_SINGLE_QUOTE__');

    // حول علامات الاقتباس المفردة إلى مزدوجة
    json = json.replace(/'/g, '"');

    // ارجع الـ escaped quotes (يجب أن تبقى single quotes في JSON)
    json = json.replace(/__ESCAPED_SINGLE_QUOTE__/g, "'");

    // أضف علامات اقتباس حول المفاتيح (مثل id: -> "id":)
    json = json.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');

    // احذف الفواصل الزائدة قبل } أو ]
    json = json.replace(/,(\s*[}\]])/g, '$1');

    // نظف المسافات الزائدة
    json = json.trim();

    // تحقق من صحة JSON قبل الكتابة
    try {
      const parsed = JSON.parse(json);
      fs.writeFileSync(jsonPath, JSON.stringify(parsed, null, 2), 'utf8');
      console.log(`✅ تم إنشاء ${path.basename(jsonPath)} بنجاح`);
    } catch (parseError) {
      console.error(`❌ خطأ في تحويل ${file}: ${parseError.message}`);
      console.error(`   أول 300 حرف: ${json.substring(0, 300)}`);
    }
  } catch (error) {
    console.error(`❌ خطأ في قراءة ${file}: ${error.message}`);
  }
});

console.log('\n✨ انتهى التحويل!');
