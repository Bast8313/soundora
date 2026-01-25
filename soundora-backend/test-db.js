// Script de test pour vérifier la base de données Supabase
import supabase from "./config/supabase.js";

console.log("🔍 Test de la base de données...\n");

// Test 1 : Vérifier les catégories disponibles
console.log("📋 CATÉGORIES DISPONIBLES :");
const { data: categories } = await supabase
  .from("categories")
  .select("id, name, slug, parent_id")
  .order("name");

categories.forEach(cat => {
  console.log(`  - ${cat.name} (slug: ${cat.slug}, id: ${cat.id})`);
});

// Test 2 : Vérifier quelques produits avec leurs category_id
console.log("\n\n📦 PRODUITS (5 premiers) :");
const { data: products } = await supabase
  .from("products")
  .select("id, name, category_id, brand_id")
  .limit(5);

products.forEach(prod => {
  console.log(`  - ${prod.name}`);
  console.log(`    category_id: ${prod.category_id || 'NULL'}`);
  console.log(`    brand_id: ${prod.brand_id || 'NULL'}`);
});

// Test 3 : Compter les produits par catégorie
console.log("\n\n📊 NOMBRE DE PRODUITS PAR CATÉGORIE :");
for (const cat of categories.filter(c => !c.parent_id)) {
  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_id", cat.id);
  
  console.log(`  - ${cat.name} (${cat.slug}): ${count} produits`);
}

// Test 4 : Tester la jointure
console.log("\n\n🔗 TEST JOINTURE (3 produits) :");
const { data: productsWithJoin, error } = await supabase
  .from("products")
  .select(`
    name,
    category:categories!category_id(name, slug),
    brand:brands!brand_id(name, slug)
  `)
  .limit(3);

if (error) {
  console.log("❌ Erreur jointure:", error);
} else {
  productsWithJoin.forEach(p => {
    console.log(`  - ${p.name}`);
    console.log(`    Catégorie: ${p.category?.name || 'NULL'}`);
    console.log(`    Marque: ${p.brand?.name || 'NULL'}`);
  });
}

console.log("\n✅ Test terminé");
process.exit(0);
