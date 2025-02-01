<%
// Fungsi untuk mengubah string menjadi format PascalCase
function toPascalCase(str) {
    return str.replace(/(^\w|-\w)/g, (match) => match.replace(/-/, '').toUpperCase());
}

// Menghasilkan nama route berdasarkan endpoint
const routeName = toPascalCase(endpoint) + 'Route';

// Menghasilkan nama controller yang diimpor
const controllerImportName = toPascalCase(controller);
%>
import <%= controllerImportName %> from "@/server/controllers/<%= controller_file_name %>";

// Group: <%= toPascalCase(endpoint) %>
const <%= routeName %> = new Hono().<%= method %>("/<%= endpoint %>", <%= controllerImportName %>);