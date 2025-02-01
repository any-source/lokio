/**
 * @author lokio
 * @generated at <%= created_at %>
 */

class <%= Name %>Class {
	async list() {
		console.log("List");
	}
	async show(id: string) {
		console.log(`Show ${id}`);
	}
	async create() {
		console.log("Create");
	}
	async update(id: string) {
		console.log(`Update ${id}`);
	}
	async delete(id: string) {
		console.log(`Delete ${id}`);
	}
}
const <%= name %>Service = new <%= Name %>Class();
export default <%= name %>Service;
