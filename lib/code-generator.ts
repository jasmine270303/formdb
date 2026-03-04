type FieldItem = {
  id: string
  type: string
}

export function generateHTML(fields: FieldItem[], formId: string) {
  const inputs = fields.map(field => {
    switch (field.type) {
      case "Text":
        return `  <input type="text" name="${field.id}" placeholder="Text" />`
      case "Email":
        return `  <input type="email" name="${field.id}" placeholder="Email" required />`
      case "Textarea":
        return `  <textarea name="${field.id}" placeholder="Message"></textarea>`
      case "Number":
        return `  <input type="number" name="${field.id}" />`
      case "Phone":
        return `  <input type="tel" name="${field.id}" />`
      case "URL":
        return `  <input type="url" name="${field.id}" />`
      case "Date":
        return `  <input type="date" name="${field.id}" />`
      case "File":
        return `  <input type="file" name="${field.id}" />`
      case "Checkbox":
        return `  <input type="checkbox" name="${field.id}" />`
      case "Radio":
        return `  <input type="radio" name="${field.id}" />`
      case "Select":
        return `  <select name="${field.id}">
    <option>Option</option>
  </select>`
      default:
        return ""
    }
  })

  return `<form action="https://formdb.io/f/${formId}" method="POST" enctype="multipart/form-data">
${inputs.join("\n")}

  <button type="submit">Submit</button>
</form>`
}

export function generateReact(fields: FieldItem[], formId: string) {
  const inputs = fields.map(field => {
    switch (field.type) {
      case "Text":
        return `      <input name="${field.id}" type="text" placeholder="Text" />`
      case "Email":
        return `      <input name="${field.id}" type="email" placeholder="Email" required />`
      case "Textarea":
        return `      <textarea name="${field.id}" placeholder="Message" />`
      case "Number":
        return `      <input name="${field.id}" type="number" />`
      case "Phone":
        return `      <input name="${field.id}" type="tel" />`
      case "URL":
        return `      <input name="${field.id}" type="url" />`
      case "Date":
        return `      <input name="${field.id}" type="date" />`
      case "File":
        return `      <input name="${field.id}" type="file" />`
      case "Checkbox":
        return `      <input name="${field.id}" type="checkbox" />`
      case "Radio":
        return `      <input name="${field.id}" type="radio" />`
      case "Select":
        return `      <select name="${field.id}">
        <option>Option</option>
      </select>`
      default:
        return ""
    }
  })

  return `function ContactForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const response = await fetch("https://formdb.io/f/${formId}", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    const result = await response.json();
    console.log("Response:", result);
  };

  return (
    <form onSubmit={handleSubmit}>
${inputs.join("\n")}

      <button type="submit">Submit</button>
    </form>
  );
}

export default ContactForm;`
}

export function generateVue(fields: FieldItem[], formId: string) {
  const modelFields = fields.map(
    field => `        ${field.id}: "",`
  )

  const inputs = fields.map(field => {
    switch (field.type) {
      case "Text":
        return `    <input v-model="form.${field.id}" type="text" name="${field.id}" placeholder="Text" />`
      case "Email":
        return `    <input v-model="form.${field.id}" type="email" name="${field.id}" placeholder="Email" required />`
      case "Textarea":
        return `    <textarea v-model="form.${field.id}" name="${field.id}" placeholder="Message"></textarea>`
      case "Number":
        return `    <input v-model="form.${field.id}" type="number" name="${field.id}" />`
      case "Phone":
        return `    <input v-model="form.${field.id}" type="tel" name="${field.id}" />`
      case "URL":
        return `    <input v-model="form.${field.id}" type="url" name="${field.id}" />`
      case "Date":
        return `    <input v-model="form.${field.id}" type="date" name="${field.id}" />`
      default:
        return ""
    }
  })

  return `<template>
  <form @submit.prevent="handleSubmit">
${inputs.join("\n")}

    <button type="submit">Submit</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      form: {
${modelFields.join("\n")}
      }
    }
  },
  methods: {
    async handleSubmit() {
      await fetch("https://formdb.io/f/${formId}", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(this.form)
      });
    }
  }
}
</script>`
}

export function generateJQuery(fields: FieldItem[], formId: string) {
  const inputs = fields.map(field => {
    switch (field.type) {
      case "Text":
        return `  <input type="text" name="${field.id}" placeholder="Text" />`
      case "Email":
        return `  <input type="email" name="${field.id}" placeholder="Email" required />`
      case "Textarea":
        return `  <textarea name="${field.id}" placeholder="Message"></textarea>`
      case "Number":
        return `  <input type="number" name="${field.id}" />`
      case "Phone":
        return `  <input type="tel" name="${field.id}" />`
      case "URL":
        return `  <input type="url" name="${field.id}" />`
      case "Date":
        return `  <input type="date" name="${field.id}" />`
      case "File":
        return `  <input type="file" name="${field.id}" />`
      default:
        return ""
    }
  })

  return `<form id="contactForm">
${inputs.join("\n")}

  <button type="submit">Submit</button>
</form>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
  $("#contactForm").on("submit", function (e) {
    e.preventDefault();

    var formData = new FormData(this);

    $.ajax({
      url: "https://formdb.io/f/${formId}",
      method: "POST",
      data: formData,
      processData: false,   
      contentType: false, 
      dataType: "json",
      success: function (data) {
        console.log("Response:", data);
      },
      error: function (err) {
        console.error("Error:", err);
      }
    });
  });
</script>`
}




