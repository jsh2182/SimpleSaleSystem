export function numberToPersian(num) {
  if (num === 0) return "صفر";
  if (typeof num !== "number" || num < 0) return "عدد نامعتبر است";

  const units = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
  const teens = [
    "ده",
    "یازده",
    "دوازده",
    "سیزده",
    "چهارده",
    "پانزده",
    "شانزده",
    "هفده",
    "هجده",
    "نوزده",
  ];
  const tens = [
    "",
    "",
    "بیست",
    "سی",
    "چهل",
    "پنجاه",
    "شصت",
    "هفتاد",
    "هشتاد",
    "نود",
  ];
  const hundreds = [
    "",
    "صد",
    "دویست",
    "سیصد",
    "چهارصد",
    "پانصد",
    "ششصد",
    "هفتصد",
    "هشتصد",
    "نهصد",
  ];

  // مقیاس‌ها: هزار، میلیون، میلیارد، تریلیون ...
  const scales = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];

  // تبدیل 3 رقم به حروف
  function threeDigitsToWord(n) {
    let h = Math.floor(n / 100);
    let t = Math.floor((n % 100) / 10);
    let u = n % 10;

    let parts = [];

    if (h) parts.push(hundreds[h]);

    if (t === 1) {
      parts.push(teens[u]);
    } else {
      if (t > 1) parts.push(tens[t]);
      if (u) parts.push(units[u]);
    }

    return parts.join(" و ");
  }

  // جداسازی سه‌رقمی‌ها
  let chunks = [];
  while (num > 0) {
    chunks.push(num % 1000);
    num = Math.floor(num / 1000);
  }

  // تبدیل هر سه‌رقمی همراه مقیاس
  let parts = [];
  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i] !== 0) {
      let chunkWord = threeDigitsToWord(chunks[i]);
      let scaleWord = scales[i];
      parts.push(chunkWord + (scaleWord ? " " + scaleWord : ""));
    }
  }

  return parts.reverse().join(" و ");
}

export async function printInvoice(
  invoice,
  detailColumns,
  fontSize,
  printIconSvg
) {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    console.error(
      "پنجره چاپ باز نشد. احتمالاً مرورگر پاپ‌آپ را بلاک کرده است."
    );
    return;
  }
  const invoiceConfig = await fetch("/invoicePrintConfig.json").then((result) =>
    result.json()
  );
  const doc = printWindow.document;

  // ساخت head
  const head = doc.createElement("head");
  const metaCharset = doc.createElement("meta");
  metaCharset.setAttribute("charset", "UTF-8");

  const title = doc.createElement("title");
  title.textContent = invoice.customerName;

  // const fontLink = doc.createElement("link");
  // fontLink.rel = "stylesheet";
  // fontLink.href = "/fonts/vazirmatn/font.css";
  const fontFace = `
@font-face {
  font-family: "Vazirmatn";
  src: url("/fonts/vazirmatn/Vazirmatn-Thin.woff2") format("woff2");
  font-weight: 100;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Vazirmatn";
  src: url("/fonts/vazirmatn/Vazirmatn-ExtraLight.woff2") format("woff2");
  font-weight: 200;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Vazirmatn";
  src: url("/fonts/vazirmatn/Vazirmatn-Light.woff2") format("woff2");
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Vazirmatn";
  src: url("/fonts/vazirmatn/Vazirmatn-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Vazirmatn";
  src: url("/fonts/vazirmatn/Vazirmatn-Medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Vazirmatn";
  src: url("/fonts/vazirmatn/Vazirmatn-SemiBold.woff2") format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Vazirmatn";
  src: url("/fonts/vazirmatn/Vazirmatn-Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Vazirmatn";
  src: url("/fonts/vazirmatn/Vazirmatn-ExtraBold.woff2") format("woff2");
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Vazirmatn";
  src: url("/fonts/vazirmatn/Vazirmatn-Black.woff2") format("woff2");
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}
@media print {
  table {
    width: 100%; /* جدول کل عرض صفحه چاپ رو بگیره */
    word-wrap: break-word; /* اگر متنی طولانیه بشکنه به خط بعد */
      table-layout: auto;/* /* ستون‌ها با عرض ثابت */
      font-size: 1.8vw;
  }
  body {
    font-family: "Vazirmatn", Arial, sans-serif !important;
    line-height: 1.5;
    font-weight: 400;
    font-feature-settings: "ss01";
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    direction: rtl;
  }
  .no-print {
      display: none !important;
  }
}

`;
  const style = doc.createElement("style");
  style.textContent = `
  ${fontFace}
    body {
      font-family: 'Vazirmatn' !important;
      font-feature-settings: "ss01";
      direction: rtl;
      color: #000;
      font-size:${fontSize || "13px"}
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    th, td {
      border: 1px solid #999;
      padding: 6px;
      text-align: right;
      vertical-align: top;
      word-wrap: break-word;
      white-space: pre-wrap;
      font-size:${fontSize || "13px"}
    }
      #tableFormalInfo td{
      border:none;
      }

    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
#tableFormalInfo tr{
background-color: transparent;
}
strong {
      color: #333;
    }
@page {
  size: A4;
  margin: 0;
}

.page-a4 {
  width: 21cm;
  min-height: 29.7cm;
  margin: 20px auto;
  background: #fff;
  box-shadow: 0 0 12px rgba(0,0,0,.25);
  position:relative;
}

/* ===== Print Safe ===== */
@media print {
  body {
    background: white;
  }

.page-a4 {
    box-shadow: none;
    margin: 0;
    width: auto;
    min-height: auto;
  }
.page-footer{
    position:fixed !important;
    }
}
  `;

  head.appendChild(metaCharset);
  head.appendChild(title);
  //head.appendChild(fontLink);
  head.appendChild(style);
  doc.head.replaceWith(head);

  // ساخت body
  const body = doc.createElement("body");

  // فیلترها
  const printDiv = doc.createElement("div");
  printDiv.onclick = () => printWindow.print();
  printDiv.innerHTML = printIconSvg;
  printDiv.className = "no-print";
  body.appendChild(printDiv);
  const filterContainer = doc.createElement("div");
  filterContainer.style.display = "flex";

  // جدول
  const table = doc.createElement("table");
  const thead = doc.createElement("thead");
  thead.style.backgroundColor = "#e9e4e4";
  const trHead = doc.createElement("tr");
  const th = doc.createElement("th");
  th.textContent = "";
  th.style.width = "1px";
  trHead.appendChild(th);
  detailColumns.forEach((col) => {
    const th = doc.createElement("th");
    th.textContent = col.label;
    trHead.appendChild(th);
  });

  thead.appendChild(trHead);
  table.appendChild(thead);

  const tbody = doc.createElement("tbody");
  // --- هدر پیش فاکتور ---
  const header = doc.createElement("div");
  header.style.width = "100%";
  header.style.marginBottom = "2px";
  header.style.maxWidth = "21cm"; /* عرض کامل A4 */
  header.style.height = "4cm"; /* ارتفاع هدر */
  header.style.backgroundImage = "url('/images/PalizInvoiceHeader.png')";
  header.style.backgroundSize = "cover"; /* تصویر کل هدر رو پر کنه */
  header.style.backgroundPosition = "center";
  header.style.margin = "auto";
  header.style.position = "relative";
  const lblDate = doc.createElement("label");
  lblDate.innerHTML = invoice.pInvoiceDate;
  lblDate.style.position = "absolute";
  lblDate.style.top = "2em";
  lblDate.style.left = "1em";
  header.appendChild(lblDate);
  const lblDash = doc.createElement("label");
  lblDash.innerHTML = "----------";
  lblDash.style.position = "absolute";
  lblDash.style.top = "3.6em";
  lblDash.style.left = "1em";
  header.appendChild(lblDash);
  const lblDash2 = doc.createElement("label");
  lblDash2.innerHTML = "----------";
  lblDash2.style.position = "absolute";
  lblDash2.style.top = "5.3em";
  lblDash2.style.left = "1em";
  header.appendChild(lblDash2);

 const divA4 = doc.createElement("div");
 divA4.className = "page-a4";
  divA4.appendChild(header);
  const pInvoiceTitle = doc.createElement("p");
  pInvoiceTitle.style.width = "100%";
  pInvoiceTitle.style.textAlign = "center";
  pInvoiceTitle.style.margin = 0;
  pInvoiceTitle.style.marginTop = 10;
  pInvoiceTitle.innerHTML = "بسمه تعالی";
  divA4.appendChild(pInvoiceTitle);
  const pInvoiceTitle2 = doc.createElement("p");
  pInvoiceTitle2.innerHTML = "پیش فاکتور";
  pInvoiceTitle2.style.width = "100%";
  pInvoiceTitle2.style.textAlign = "center";
  pInvoiceTitle2.style.margin = 0;
  pInvoiceTitle2.style.fontWeight = "700";
  divA4.appendChild(pInvoiceTitle2);
  const pCustomerTitle = doc.createElement("p");
  pCustomerTitle.innerHTML = "حضور محترم شرکت: " + invoice.customerName;
  pCustomerTitle.style.width = "100%";
  pCustomerTitle.style.textAlign = "right";
  pCustomerTitle.style.margin = 0;
  pCustomerTitle.style.fontWeight = "700";
  divA4.appendChild(pCustomerTitle);
  let i = 0;
  invoice.invoiceDetails.forEach((row) => {
    const tr = doc.createElement("tr");
    if (i % 2 === 1) {
      tr.style.background = "#efefef";
    }
    i++;
    const tdRowNumber = doc.createElement("td");
    //  tdRowNumber.style.width = "1px";
    tdRowNumber.innerHTML = i;
    tr.appendChild(tdRowNumber);
    detailColumns.forEach((col) => {
      const td = doc.createElement("td");
      const val =
        typeof col.render === "function"
          ? col.render(row[col.name], row)
          : row[col.name];
      if (col.type === "boolean") {
        td.innerHTML = val === "true" ? "☑" : "☐";
      } else if (col.type === "currency") {
        td.innerHTML = Intl.NumberFormat().format(val ?? "0") ?? "";
      } else {
        td.innerHTML = val ?? "";
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  const lastRow = doc.createElement("tr");
  const tdTitle = doc.createElement("td");
  tdTitle.innerHTML = "جمع کل";
  tdTitle.style.whiteSpace = "nowrap";
  lastRow.appendChild(tdTitle);
  const tdTotalPriceInLetter = doc.createElement("td");
  tdTotalPriceInLetter.colSpan = detailColumns.length - 1;
  tdTotalPriceInLetter.innerHTML =
    numberToPersian(invoice.invoiceNetPrice) + " ریال";
  lastRow.appendChild(tdTotalPriceInLetter);
  const tdTotalPrice = doc.createElement("td");
  tdTotalPrice.innerHTML = Intl.NumberFormat().format(invoice.invoiceNetPrice);
  lastRow.appendChild(tdTotalPrice);
  tbody.appendChild(lastRow);
  table.appendChild(tbody);
  divA4.appendChild(table);
  const pPointTitle = doc.createElement("p");
  pPointTitle.innerHTML = "نکات قابل توجه: ";
  pPointTitle.style.fontWeight = "700";
  pPointTitle.style.textAlign = "right";
  pPointTitle.style.marginBottom = 0;
  divA4.appendChild(pPointTitle);
  const listPoints = document.createElement("ul");
  invoiceConfig.invoicePoints.forEach((p) => {
    const item = doc.createElement("li");
    item.innerHTML = p;
    listPoints.appendChild(item);
  });
  divA4.appendChild(listPoints);
  const lastParagraph = doc.createElement("p");
  lastParagraph.innerHTML = `لطفا پس از واریز وجه و تکمیل فرم زیر ، سند واریزی  و این فرم را پس از مهر و امضاء از طریق برنامه ایتا یا واتساپ به شماره ${
    invoiceConfig.mobileNo ?? ""
  } ارسال نموده  و از همین طریق یا اپراتور  شرکت ${
    invoiceConfig.phoneNo ?? ""
  }  داخلی (صفر)  تاییدیه را دریافت نمایید. `;
  divA4.appendChild(lastParagraph);
  const divFormalInvoiceInfo = doc.createElement("div");
  divFormalInvoiceInfo.style.border = "1px solid";
  divFormalInvoiceInfo.style.borderRadius = "3px";
  divFormalInvoiceInfo.style.position = "relative";
  divFormalInvoiceInfo.style.marginTop = "15px";
  const tableBodyFormalInfo = doc.createElement("tbody");
  tableBodyFormalInfo.style.width = "100%";
  const tr1 = doc.createElement("tr");
  const td11 = document.createElement("td");
  td11.innerHTML = "اینجانب:  ";
  tr1.appendChild(td11);
  const td12 = document.createElement("td");
  td12.innerHTML = "مدیر/ نماینده شرکت:";
  tr1.appendChild(td12);
  tableBodyFormalInfo.appendChild(tr1);

  const tr2 = doc.createElement("tr");
  const td21 = document.createElement("td");
  td21.innerHTML = "تلفن ثابت و همراه:";
  tr2.appendChild(td21);
  const td22 = document.createElement("td");
  td22.innerHTML = "فکس:";
  tr2.appendChild(td22);
  tableBodyFormalInfo.appendChild(tr2);

  const tr3 = doc.createElement("tr");
  const td31 = document.createElement("td");
  td31.colSpan = 2;
  td31.innerHTML = "آدرس:";
  tr3.appendChild(td31);
  tableBodyFormalInfo.appendChild(tr3);

  const tr4 = doc.createElement("tr");
  const td41 = document.createElement("td");
  td41.innerHTML = "کد پستی:";
  tr4.appendChild(td41);
  const td42 = document.createElement("td");
  td42.innerHTML = "کد اقتصادی:";
  tr4.appendChild(td42);
  tableBodyFormalInfo.appendChild(tr4);

  const tr5 = doc.createElement("tr");
  const td51 = document.createElement("td");
  td51.innerHTML = "شناسه ملی / کد ملی:";
  tr5.appendChild(td51);
  const td52 = document.createElement("td");
  td52.innerHTML = "صحت اطلاعات فوق را تایید می نمایم.";
  tr5.appendChild(td52);
  tableBodyFormalInfo.appendChild(tr5);

  const tableFormalInfo = doc.createElement("table");
  tableFormalInfo.style.marginTop = "10px";
  tableFormalInfo.id = "tableFormalInfo";
  tableFormalInfo.appendChild(tableBodyFormalInfo);
  divFormalInvoiceInfo.appendChild(tableFormalInfo);
  const titleformalInfo = doc.createElement("label");
  titleformalInfo.innerHTML =
    "جهت دریافت فاکتور رسمی حتما اطلاعات زیر را با دقت تکمیل نمایید.";
  titleformalInfo.style.position = "absolute";
  titleformalInfo.style.top = "-1.1em";
  titleformalInfo.style.right = "12px";
  titleformalInfo.style.backgroundColor = "white";
  divFormalInvoiceInfo.appendChild(titleformalInfo);

  divA4.appendChild(divFormalInvoiceInfo);
  const footer = doc.createElement("div");
  footer.className="page-footer";
  footer.style.width = "100%";
  footer.style.marginTop = "2px";
  footer.style.width = "21cm"; /* عرض کامل A4 */
  footer.style.height = "4cm"; /* ارتفاع هدر */
  footer.style.backgroundImage = "url('/images/PalizInvoiceFooter.png')";
  // footer.style.backgroundSize = "cover";
  footer.style.backgroundSize = "contain";
  footer.style.backgroundPosition = "center";
  footer.style.margin = "auto";
  footer.style.position = "absolute";
  // footer.style.bottom = "10px";
  // footer.style.right = "50%";
  footer.style.bottom = 0;
  footer.style.right = 0;
  footer.style.left = 0;
  footer.style.backgroundRepeat = "no-repeat";
  //footer.style.transform = "translateX(50%)";
  divA4.appendChild(footer);

  const stamp = doc.createElement("div");
  stamp.style.position = "absolute";
  stamp.style.backgroundImage = "url('/images/PalizStamp.png')";
  stamp.style.backgroundSize = "cover";
  stamp.style.backgroundPosition = "center";
  stamp.style.top = "50%";
  stamp.style.left = "40";
  stamp.style.width = "197";
  stamp.style.height = "77";
  stamp.style.mixBlendMode="multiply";
  divA4.appendChild(stamp);
  body.appendChild(divA4);
  doc.body.replaceWith(body);
  // منتظر لود فونت و استایل باش بعد پرینت کن
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}
export const  keyIsLetterOrNumber =(char, allowPersian = true, allowSpace = false) =>{
    // حروف انگلیسی
    const englishRegex = /^[a-zA-Z]$/;

    // حروف فارسی
    const persianRegex = /^[\u0600-\u06FF]$/;

    // اعداد فارسی + انگلیسی
    const numberRegex = /^[0-9\u06F0-\u06F9]$/;

    // بررسی فاصله
    if (!allowSpace && char === " ") {
        return false;
    }
    if (allowSpace && char === " ") {
        return true;
    }

    // اگر فارسی مجاز نباشد → فقط چک انگلیسی و عدد
    if (!allowPersian) {
        return englishRegex.test(char) || numberRegex.test(char);
    }

    // حالت کامل → انگلیسی یا فارسی یا عدد
    return (
        englishRegex.test(char) ||
        persianRegex.test(char) ||
        numberRegex.test(char)
    );
}



