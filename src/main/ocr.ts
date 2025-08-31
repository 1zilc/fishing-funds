import { createWorker, PSM } from 'tesseract.js';
// import scribe from 'scribe.js-ocr';
import { tesseractLangPath } from './util';

interface Fund {
  name: string;
  zje: string;
  cysy: string;
  cysyl: string;
}

abstract class OCR {
  abstract funds(...args: any[]): Promise<Fund[]>;
}

export class TesseractOCR extends OCR {
  constructor() {
    super();
  }

  async funds(img: Tesseract.ImageLike, dpi: string = '72'): Promise<Fund[]> {
    const worker = await createWorker('chi_sim', undefined, {
      langPath: tesseractLangPath,
    });
    worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_COLUMN, // PSM.AUTO_OSD
      // preserve_interword_spaces: '1',
      tessedit_char_blacklist: ',”“',
      // tessedit_char_whitelist: '0123456789,+-.%',
      user_defined_dpi: dpi,
    });
    const ret = await worker.recognize(img, {}, { blocks: true });

    const maxX = Math.max(...ret.data.blocks!.map((b) => b.bbox.x1));
    // const maxY = Math.max(...ret.data.blocks!.map((b) => b.bbox.y1));
    const blocks = ret.data.blocks;

    const funds: Fund[] = [];

    let i = 0;

    blocks?.forEach((item) => {
      item.paragraphs.forEach((p) => {
        // console.log(p.text);
        p.lines.forEach((l) => {
          const w = p.bbox.x1 - p.bbox.x0;
          const h = p.bbox.y1 - p.bbox.y0;

          if (w > 140 && p.bbox.y0 > 800) {
            if (
              l.bbox.x0 < 100 &&
              !l.text.includes('%') &&
              !l.text.includes('金额') &&
              !l.text.includes('全 部') &&
              !l.text.includes('投资')
            ) {
              if ((l.text.includes('+') || l.text.includes('-')) && /^\d.*/.test(l.text.trim())) {
                const v = l.text.split('\n').slice(0, 2).join('');
                const [zje, rsy, cysy, ljsy] = v.split(' ');
                funds[i] = {
                  ...(funds[i] || {}),
                  zje: zje.replaceAll(',', '').replace(/\.(?=.*\.)/g, ''),
                  //   rsy: rsy.replaceAll(',', '').replace(/\.(?=.*\.)/g, ''),
                  cysy: cysy.replaceAll(',', '').replace(/\.(?=.*\.)/g, ''),
                  //   ljsy: ljsy.replaceAll(',', '').replace(/\.(?=.*\.)/g, ''),
                };
              } else {
                const v = l.text.split('\n').slice(0, 2).join('');
                funds[i] = {
                  ...(funds[i] || {}),
                  name: v.replaceAll(' ', ''),
                };
              }
            }
            l.words.forEach((w) => {
              if (w.text.includes('%') && w.bbox.x0 > maxX / 2) {
                funds[i] = {
                  ...(funds[i] || {}),
                  cysyl: w.text.trim(),
                };
                i++;
              }
            });
          }
        });
      });
    });

    // console.table(funds);
    // await fs.writeFileSync('./output.json', JSON.stringify(funds, null, 2));
    await worker.terminate();

    return funds;
  }
}

// export class ScribeOCR extends OCR {
//   async funds(img: Tesseract.ImageLike, dpi: string = '72'): Promise<Fund[]> {
//     const funds: Fund[] = [];
//     let i = 0;

//     await scribe.init({ ocr: true, font: false });
//     await scribe.importFiles([img]);
//     await scribe
//       .recognize({
//         langs: ['chi_sim'],
//       })
//       .then((res) => {
//         const maxX = Math.max(...res.map((p) => p.dims.width));

//         res.forEach((p) => {
//           p.lines.forEach((l) => {
//             // const width = l.bbox.right - w.bbox.left;
//             const ltext = l.words.map((w) => w.text).join(' ');
//             if (
//               l.bbox.left < 100 &&
//               l.bbox.top > 800 &&
//               !ltext.includes('%') &&
//               !ltext.includes('金额') &&
//               !ltext.includes('增 定') &&
//               !ltext.includes('投 资') &&
//               !ltext.includes('全 ')
//             ) {
//               console.log(ltext);
//               console.log('-------------------');

//               if ((ltext.includes('+') || ltext.includes('-')) && /^\d.*/.test(ltext.trim())) {
//                 const v = ltext.split('\n').slice(0, 2).join('');
//                 const [zje, rsy, cysy, ljsy] = v.split(' ');
//                 funds[i] = {
//                   ...(funds[i] || {}),
//                   zje: zje
//                     .replaceAll('′', '')
//                     .replaceAll(',', '')
//                     .replace(/\.(?=.*\.)/g, ''),
//                   rsy: rsy
//                     .replaceAll('′', '')
//                     .replaceAll(',', '')
//                     .replace(/\.(?=.*\.)/g, '')
//                     .replace(/\.(?=\-*\-)/g, ''),
//                   cysy: cysy
//                     .replaceAll('′', '')
//                     .replaceAll(',', '')
//                     .replace(/\.(?=.*\.)/g, ''),
//                   ljsy: ljsy
//                     .replaceAll('′', '')
//                     .replaceAll(',', '')
//                     .replace(/\.(?=.*\.)/g, ''),
//                 };
//               } else {
//                 const v = ltext.split('\n').slice(0, 2).join('');
//                 funds[i] = {
//                   ...(funds[i] || {}),
//                   name: v.replaceAll(' ', ''),
//                 };
//               }
//             }
//             l.words.forEach((w) => {
//               if (w.text.includes('%') && w.bbox.right > maxX / 2) {
//                 // console.log(w.text);
//                 funds[i] = {
//                   ...(funds[i] || {}),
//                   cysyl: w.text.trim(),
//                 };
//                 i++;
//               }
//             });
//           });
//         });
//       });
//     // console.table(funds);
//     await scribe.terminate();
//     return funds;
//   }
// }
