// Script de diagnostic pour vérifier les amplis
import supabase from "./config/supabase.js";

console.log("DIAGNOSTIC DES AMPLIS\n");
console.log("=".repeat(80));

// 1. Récupérer toutes les catégories d'amplis
console.log("\n Catégories d'amplification disponibles :");
const { data: ampliCategories } = await supabase
  .from("categories")
  .select("id, name, slug")
  .or("name.ilike.%ampli%,slug.ilike.%ampli%");

if (ampliCategories && ampliCategories.length > 0) {
  ampliCategories.forEach((cat) => {
    console.log(`  - ${cat.name} (slug: ${cat.slug})`);
  });
} else {
  console.log("   Aucune catégorie d'ampli trouvée!");
}

// 2. Récupérer tous les amplis
console.log("\n AMPLIS EN BASE DE DONNÉES :");
console.log("-".repeat(80));

const ampliCategoryIds = ampliCategories?.map((c) => c.id) || [];

if (ampliCategoryIds.length > 0) {
  const { data: amplis, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      model,
      slug,
      images,
      category:categories!category_id(name, slug),
      brand:brands!brand_id(name, slug)
    `,
    )
    .in("category_id", ampliCategoryIds)
    .order("name");

  if (error) {
    console.log(" Erreur:", error);
  } else if (amplis && amplis.length > 0) {
    console.log(`\nTotal : ${amplis.length} amplis trouvés\n`);

    amplis.forEach((ampli, index) => {
      console.log(`${index + 1}. ${ampli.name}`);
      console.log(`    Modèle en BDD: "${ampli.model || "NULL"}"`);
      console.log(`    Slug: ${ampli.slug}`);
      console.log(`     Marque: ${ampli.brand?.name || "NULL"}`);
      console.log(`    Catégorie: ${ampli.category?.name || "NULL"}`);

      // Vérifier les images
      let hasImage = false;
      if (
        ampli.images &&
        Array.isArray(ampli.images) &&
        ampli.images.length > 0
      ) {
        console.log(`   🖼️  Images (JSON): ${ampli.images[0]}`);
        hasImage = true;
      } else {
        console.log(`   ⚠️  Aucune image en BDD`);
      }

      // Vérifier le mapping
      const modelKey = ampli.model ? ampli.model.toLowerCase() : null;
      const expectedImages = {
        "svt-7 pro": "ampeg-svt-7-pro.jpg",
        "blues junior iv": "fender-blues-junior-iv.jpg",
        "rumble 500": "fender-rumble-500.jpg",
        dsl40cr: "marshall-dsl40cr.jpg",
        "jcm800 2203": "marshall-jcm800-2203.jpg",
        "rockerverb 50 mkiii": "orange-rockerverb-50-mkiii.jpg",
        "rocker 30": "orange-rocker-30.jpg",
        ac30c2: "vox-ac30c2.jpg",
        "terror bass 500": "orange-terror-bass-500.jpg",
        "mark v:25": "mesa-mark-v25.jpg",
      };

      if (modelKey && expectedImages[modelKey]) {
        console.log(
          `   ✅ Mapping trouvé: assets/images/products/${expectedImages[modelKey]}`,
        );
      } else if (modelKey) {
        console.log(`   ❌ PAS DE MAPPING pour modèle: "${modelKey}"`);
        console.log(
          `   💡 Ajouter au mapping: '${modelKey}': 'nom-fichier.jpg'`,
        );
      } else {
        console.log(`   ❌ Modèle NULL - impossible de mapper l'image`);
      }

      console.log("");
    });

    // Résumé
    const withModel = amplis.filter((a) => a.model && a.model.trim() !== "");
    const withoutModel = amplis.filter(
      (a) => !a.model || a.model.trim() === "",
    );

    console.log("=".repeat(80));
    console.log("\n📊 RÉSUMÉ :");
    console.log(`   Total amplis : ${amplis.length}`);
    console.log(`   ✅ Avec modèle : ${withModel.length}`);
    console.log(`   ❌ Sans modèle : ${withoutModel.length}`);

    if (withoutModel.length > 0) {
      console.log("\n⚠️  AMPLIS SANS MODÈLE (à corriger) :");
      withoutModel.forEach((a) => {
        console.log(`   - ${a.name} (slug: ${a.slug})`);
      });
    }
  } else {
    console.log("❌ Aucun ampli trouvé dans ces catégories!");
  }
} else {
  console.log(
    "❌ Aucune catégorie d'ampli, impossible de chercher les produits!",
  );
}

console.log("\n✅ Diagnostic terminé");
process.exit(0);
