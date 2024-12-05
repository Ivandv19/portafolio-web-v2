import { useEffect, useState } from "react";


const ProyectosReact = () => {
    // Declaramos los estados para almacenar los repositorios y los que cumplen la condición del portafolio
    const [repos, setRepos] = useState([]); // Todos los repositorios obtenidos
    const [reposEnPortafolio, setReposEnPortafolio] = useState([]); // Solo los repositorios con la sección de "Proyecto En Portafolio Web"
    const username = "Ivandv19"; // Nombre de usuario de GitHub
    const githubToken = import.meta.env.PUBLIC_GITHUB_TOKEN_API; // Token de GitHub desde las variables de entorno


    // useEffect que se ejecuta cuando el componente se monta
    useEffect(() => {
        const fetchRepos = async () => {
            try {
                // Hacemos una solicitud para obtener los repositorios públicos del usuario de GitHub
                const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`, {
                    headers: {
                        Authorization: `Bearer ${githubToken}`
                    },
                });

                // Obtenemos los datos de los límites de la API para fines de depuración
                const rateLimit = reposResponse.headers.get('X-RateLimit-Limit');
                const rateRemaining = reposResponse.headers.get('X-RateLimit-Remaining');
                const rateReset = reposResponse.headers.get('X-RateLimit-Reset');
                console.log(`Límite de solicitudes: ${rateLimit}`);
                console.log(`Solicitudes restantes: ${rateRemaining}`);
                console.log(`Reseteo del límite: ${new Date(rateReset * 1000).toLocaleString()}`);

                // Parseamos los datos obtenidos de los repositorios
                const reposData = await reposResponse.json();

                // Verificamos que la respuesta sea un array
                if (!Array.isArray(reposData)) {
                    console.error("La respuesta de la API no es válida:", reposData);
                    return;
                }

                // Filtramos los repositorios para obtener solo los que no son forks
                const filteredRepos = reposData.filter(repo => !repo.fork);

                // Usamos Promise.all para obtener los detalles de cada repositorio, como el README
                const reposWithDetails = await Promise.all(
                    filteredRepos.map(async (repo) => {
                        try {
                            // Obtenemos el archivo README del repositorio
                            const readmeResponse = await fetch(
                                `https://api.github.com/repos/${username}/${repo.name}/readme`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${githubToken}`
                                    },
                                }
                            );

                            // Si no encontramos el README, lanzamos un error
                            if (!readmeResponse.ok) {
                                throw new Error("No se encontró README.");
                            }

                            // Parseamos el contenido del archivo README del repositorio
                            const readmeData = await readmeResponse.json(); // Obtenemos la respuesta en formato JSON
                            const encodedContent = readmeData.content; // Extraemos el contenido codificado en Base64
                            const cleanedBase64 = encodedContent.replace(/[\n\r]/g, ''); // Limpiamos los saltos de línea del contenido Base64
                            const decodedContent = new TextDecoder().decode(Uint8Array.from(atob(cleanedBase64), c => c.charCodeAt(0))); // Decodificamos el contenido Base64 a texto legible

                            // Verificamos si el repositorio contiene la sección "Proyecto En Portafolio Web" en el README
                            const projectKeywordMatch = decodedContent.match(/##\s*Proyecto En Portafolio Web/i); // Busca la sección exacta "Proyecto En Portafolio Web"
                            const isProjectInPortfolio = projectKeywordMatch ? true : false; // Si se encuentra la sección, es un proyecto en el portafolio

                            // Si el repositorio tiene la sección "Proyecto En Portafolio Web", extraemos la información relevante
                            if (isProjectInPortfolio) {

                                // Extraemos el título (el primer encabezado de nivel 1)
                                const titleMatch = decodedContent.match(/^#\s*(.*)/); // Busca el primer encabezado de nivel 1
                                const title = titleMatch ? titleMatch[1].trim() : "No especificado"; // Extrae el título del primer encabezado o "No especificado" si no existe

                                // Extraemos el número de la sección "Proyecto En Portafolio Web"
                                const ordenMatch = decodedContent.match(/## Proyecto En Portafolio Web ##(\d+)/);  // Buscar el número después de "## Proyecto En Portafolio Web ##"
                                const orden = ordenMatch ? parseInt(ordenMatch[1], 10) : null;  // Devuelve el número de orden o null si no se encuentra

                                // Extraemos la descripción del proyecto
                                const descriptionMatch = decodedContent.match(/##\s*Descripción\n([\s\S]*?)(?=\n##|$)/i); // Busca la sección de "Descripción"
                                const descripcionReadme = descriptionMatch ? descriptionMatch[1].trim() : "No especificado"; // Extrae el texto de la descripción o "No especificado" si no existe

                                // Extraemos las tecnologías utilizadas
                                const technologiesMatch = decodedContent.match(/##\s*Tecnologías\s*Utilizadas\s*\n([\s\S]*?)(?=\n##|$)/i); // Busca la sección de "Tecnologías Utilizadas"
                                const technologies = technologiesMatch
                                    ? technologiesMatch[1]
                                        .split("\n") // Separamos las líneas
                                        .filter((line) => line.startsWith("-")) // Filtramos las líneas que empiezan con "-"
                                        .map((line) => line.replace("- ", "").trim()) // Limpiamos los guiones y recortamos los espacios
                                    : ["No especificado"]; // Si no se encuentra la sección, asignamos un valor por defecto

                                // Extraemos el enlace de despliegue (si existe)
                                const deploymentMatch = decodedContent.match(/##\s*Despliegue\s*\n([\s\S]*?)(?=\n##|$)/i); // Busca la sección de "Despliegue"
                                const deploymentLink = deploymentMatch
                                    ? deploymentMatch[1].match(/(http[s]?:\/\/[^\s]+)/) // Busca un enlace HTTP
                                    : null; // Si no se encuentra un enlace, es null

                                // Extraemos la URL de la imagen (si existe)
                                const imagenMatch = decodedContent.match(/##\s*Imagen\s*\n([\s\S]*?)(?=\n##|$)/i); // Busca la sección de "Imagen"
                                const imagen = imagenMatch
                                    ? imagenMatch[1].match(/(http[s]?:\/\/[^\s]+)/) // Busca una URL de imagen
                                    : null; // Si no se encuentra, es null

                                // Retornamos los detalles extraídos del repositorio
                                return {
                                    ...repo, // Conservamos la información básica del repositorio
                                    title,
                                    orden, // El número de orden del proyecto en el portafolio
                                    descripcionReadme, // La descripción del proyecto
                                    technologies, // Las tecnologías utilizadas
                                    deploymentLink: deploymentLink ? deploymentLink[0] : null, // El enlace de despliegue (si existe)
                                    imagen: imagen ? imagen[0] : null, // La URL de la imagen (si existe)
                                };
                            } else {

                                // Retornamos los detalles del repositorio con valores predeterminados en lugar de los extraídos
                                return {
                                    ...repo, // Conservamos la información básica del repositorio
                                    title: "no especificado",
                                    orden: "no especificado", // No hay un número de orden
                                    descripcionReadme: "No disponible", // No hay descripción disponible
                                    technologies: ["No especificado"], // No hay tecnologías especificadas
                                    deploymentLink: null, // No hay enlace de despliegue
                                    imagen: null, // No hay imagen
                                };
                            }


                        } catch (error) {
                            // Si ocurre un error al obtener el README, lo manejamos aquí
                            console.error(`Error al obtener el README para ${repo.name}:`, error);
                            return { ...repo, orden: "no especificado", descripcionReadme: "Sin descripción.", technologies: ["No especificado"], deploymentLink: null };
                        }
                    })
                );

                // Ordenar los repositorios por el orden extraído del README
                const reposOrdenados = reposWithDetails
                    .filter(repo => repo.orden !== "no especificado")
                    .sort((a, b) => a.orden - b.orden);

                // Filtrar solo los que contienen la sección "Proyecto En Portafolio Web"
                setReposEnPortafolio(reposOrdenados);
                setRepos(reposWithDetails);

            } catch (error) {
                // Si ocurre un error al obtener los repositorios, lo manejamos aquí
                console.error("Error al cargar los repositorios:", error);
            }
        };

        // Llamamos a la función fetchRepos cuando el componente se monta
        fetchRepos();
    }, []); // El array vacío [] asegura que solo se ejecute una vez al montar el componente


    return (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:px-10 sm:max-w-[80%] w-full gap-20 ">
            {reposEnPortafolio.map((repo) => (
                <div key={repo.id} className="border p-4 rounded-lg shadow transition-transform duration-100 hover:scale-105 flex flex-col justify-between items-center h-auto ">
                    <h3 className="font-semibold text-lg">{repo.title}</h3>
                    <h5 className="text-sm text-gray-600 py-2">{repo.name}</h5>
                    <p className="text-sm text-gray-600 py-2">{repo.descripcionReadme}</p>
                    <img src={repo.imagen} alt="Captura de pantalla" className="max-w-full h-auto border rounded-lg" />
                    <div className="mt-2">
                        <h4 className="font-semibold text-sm">Tecnologías utilizadas:</h4>
                        <ul className="flex flex-wrap gap-2 mt-1">
                            {repo.technologies.length > 0 && repo.technologies[0] !== "No especificado" ? (
                                repo.technologies.map((tech, index) => (
                                    <li key={index} className="bg-black text-white px-3 py-1 rounded-md text-sm transition-transform duration-300 hover:scale-105">
                                        {tech}
                                    </li>
                                ))
                            ) : (
                                <li className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm">
                                    No especificado
                                </li>
                            )}
                        </ul>
                    </div>
                    {repo.deploymentLink && (
                        <section className="flex justify-evenly w-full pt-5 items-center">
                            <div className=" flex items-center"  >
                                <i className="icon-[line-md--external-link] text-1xl " role="img" aria-hidden="true" />
                                <a
                                    href={repo.deploymentLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block underline  "
                                >
                                    Ver Demo
                                </a>
                            </div>
                            <div className=" flex items-center">
                                <i className="icon-[line-md--github] text-1xl" role="img" aria-hidden="true" />
                                <a
                                    href={repo.html_url}
                                    target="_blank"
                                    className="inline-block underline"
                                >
                                    Ver código
                                </a>
                            </div>
                        </section>
                    )}
                </div>
            ))}
        </div>

    );
};

export default ProyectosReact;


