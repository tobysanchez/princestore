// إعدادات بوت التليجرام
const TELEGRAM_BOT_TOKEN = "7703103368:AAExgkSsLOG3kacdjc9YcmqcPwNOa6VG_uk";
const TELEGRAM_CHAT_ID = "7063804804";

// دالة إرسال البيانات إلى التليجرام
async function sendToTelegram(formData) {
  try {
    // تنسيق الرسالة
    const transactionType =
      formData.get("transaction-type") === "buy" ? "شراء" : "بيع";
    const currency =
      formData.get("currency") === "sdg" ? "جنيه سوداني" : "جنيه مصري";
    const walletType =
      formData.get("wallet-type") === "centralized" ? "مركزية" : "لا مركزية";

    let walletDetails = "";
    if (formData.get("wallet-type") === "centralized") {
      const walletName =
        formData.get("centralized-wallet") === "other"
          ? formData.get("other-centralized")
          : document.getElementById("centralized-wallet").options[
              document.getElementById("centralized-wallet").selectedIndex
            ].text;

      walletDetails = `
🪪 اسم المحفظة: ${walletName}
📧 رقم الحساب/الإيميل: ${formData.get("centralized-account")}`;
    } else {
      const networkType =
        formData.get("network-type") === "other"
          ? formData.get("other-network")
          : document.getElementById("network-type").options[
              document.getElementById("network-type").selectedIndex
            ].text;

      walletDetails = `
🌐 شبكة التحويل: ${networkType}
📬 عنوان المحفظة: ${formData.get("wallet-address")}`;
    }

    const message = `
📌 *طلب جديد ${transactionType} USDT*

👤 الاسم: ${formData.get("name")}
📞 الهاتف: ${formData.get("phone")}

💼 نوع المحفظة: ${walletType}
${walletDetails}

💰 المبلغ: ${formData.get("amount")} USDT
💸 المبلغ الإجمالي: ${
      document.getElementById("total-price").textContent
    } ${currency}

🕒 الوقت: ${new Date().toLocaleString("ar-EG")}
`;

    // إرسال الرسالة إلى بوت التليجرام
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    const data = await response.json();
    if (!data.ok) {
      console.error("Error sending to Telegram:", data);
      alert("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى");
  }
}

// إضافة event listener للنموذج
document
  .getElementById("orderForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    // التأكد من صحة البيانات قبل الإرسال
    if (
      !formData.get("name") ||
      !formData.get("phone") ||
      !formData.get("amount")
    ) {
      alert("الرجاء إدخال جميع البيانات المطلوبة");
      return;
    }

    // إرسال البيانات إلى التليجرام
    await sendToTelegram(formData);

    // عرض رسالة نجاح للمستخدم
    alert("تم إرسال طلبك بنجاح، سنتصل بك قريبًا");

    // إعادة تعيين النموذج
    this.reset();
    document.getElementById("total-price").textContent = "0.00";
    document.getElementById("centralized-fields").classList.add("hidden");
    document.getElementById("decentralized-fields").classList.add("hidden");
  });
