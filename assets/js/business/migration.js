(function(root){'use strict';
  const collections=['customers','quotes','invoices','incomes','expenses'];
  const singular={customers:'Customer',quotes:'Quote',invoices:'Invoice',incomes:'Income',expenses:'Expense'};
  const counts=data=>Object.fromEntries(collections.map(key=>[key,Array.isArray(data&&data[key])?data[key].length:0]));
  async function localPreview(){if(!root.DMLocalStorage)throw new Error('El almacenamiento local no está disponible.');const data=await root.DMLocalStorage.exportData();return {data,counts:counts(data),hasData:collections.some(key=>(data[key]||[]).length>0)};}
  async function cloudCounts(){const out={};for(const key of collections)out[key]=(await root.DMCloudStorage[`get${singular[key]}s`]()).length;return out;}
  async function importData(data,{allowExisting=false}={}){if(!root.DMAuth||!await root.DMAuth.getCurrentUser())throw new Error('Inicia sesión antes de importar.');const before=await cloudCounts();if(!allowExisting&&Object.values(before).some(Boolean))throw new Error('Tu cuenta ya contiene datos. Revisa la advertencia antes de combinar registros.');if(data.businessProfile)await root.DMCloudStorage.saveBusinessProfile(data.businessProfile);
    for(const key of collections){for(const row of data[key]||[])await root.DMCloudStorage[`save${singular[key]}`](row);}if(root.DMAutomationService&&Array.isArray(data.automationRules))await root.DMAutomationService.importRules(data.automationRules);if(root.DMRecurringService&&Array.isArray(data.recurringTemplates))await root.DMRecurringService.importTemplates(data.recurringTemplates);
    const after=await cloudCounts(),expected=counts(data);for(const key of collections)if(after[key]<Math.max(before[key],expected[key]))throw new Error(`No se pudo validar la importación de ${key}.`);return {before,after,imported:expected};}
  async function importLocal(options){const preview=await localPreview();if(!preview.hasData)return {before:await cloudCounts(),after:await cloudCounts(),imported:preview.counts};return importData(preview.data,options);}
  root.DMMigration={counts,localPreview,cloudCounts,importData,importLocal};
}(window));
