const multer = require('multer')

// On crée une base de référence pour les mime-types
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
}

// On crée un objet de configuration pour multer avec deux éléments : destination & filename
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // 1er argument null si pas d'erreur, avec images pour le nom du dossier où on veut stocker les images
    callback(null, 'images')
  },
  // On crée un nouveau nom de fichier pour éviter que deux fichiers aient le même nom
  filename: (req, file, callback) => {
    // On récupère le nom d'origine du fichier en éliminant les espaces pour éviter des problèmes côté serveur, et qu'on remplace par underscore (tiret 8 du clavier)
    const name = file.originalname.split(' ').join('_')
    // On récupère le nom du fichier sans extension
    const nameNoExtension = name.split('.')[0]
    // On génère une extension au fichier
    const extension = MIME_TYPES[file.mimetype]
    callback(null, nameNoExtension + Date.now() + '.' + extension)
  },
})

// On appelle la méthode multer avec notre objet storage, on utilise la méthode single car il s'agit d'un fichier unique et non d'un groupe de fichiers, en indiquant qu'il s'agit d'un fichier image
module.exports = multer({ storage: storage }).single('image')