pipeline { 
    agent any 
    tools { 
        nodejs 'Node_24'  // Configurado en Global Tools
        sonarScanner 'SonarQubeScanner'
    }
    environment { 
        SONAR_PROJECT_KEY = 'ucp-app-react' 
        SONAR_PROJECT_NAME = 'UCP React App' 
    } 
    stages { 
        // Etapa 1: Checkout 
        stage('Checkout') { 
            steps { 
                git branch: 'main', url: 'https://github.com/amartinezh/ucp-app-react.git' 
            } 
        } 
     // Nueva etapa: Análisis de SonarQube 
        stage('SonarQube Analysis') { 
            steps { 
                withSonarQubeEnv('SonarQube') { 
                    sh ''' 
                        sonar-scanner \
                        -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                        -Dsonar.projectName=${SONAR_PROJECT_NAME} \
                        -Dsonar.sources=src \
                        -Dsonar.host.url=http://localhost:9000 \
                        -Dsonar.login=${SONAR_AUTH_TOKEN} \
                        -Dsonar.javascript.node=${NODEJS_HOME}/bin/node \
                        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info 
                    ''' 
                } 
            } 
        } 

        // Etapa 2: Build 
        stage('Build') { 
            steps { 
                sh 'npm install' 
                sh 'npm run build' 
            } 
        }

        //Snyk step
        /*stage('Security Scan with Snyk'){
            steps{
                // Instalar CLI de Snyk
                sh 'npm install -g snyk'

                //Autenticar
                sh 'snyk auth ${SNYK_TOKEN}'
                
                // Ejecutar test de seguridad
                sh 'snyk test --all-projects --severity-threshold=high'

                //Opcional: Monitorear en Snyk (registra resultados en dashboard)
                sh 'snyk monitor --all-projects'
                      
                    // 5. Generar reporte HTML (opcional) 
                    sh 'snyk test --all-projects --json-file-output=snyk_results.json' 
                    sh ''' 
                        npm install -g snyk-to-html 
                        snyk-to-html -i snyk_results.json -o snyk_report.html 
                    ''' 
                     
                    // Publicar reporte Snyk 
                    publishHTML target: [ 
                        allowMissing: true, 
                        alwaysLinkToLastBuild: true, 
                        keepAll: true, 
                        reportDir: '.', 
                        reportFiles: 'snyk_report.html', 
                        reportName: 'Snyk Security Report' 
                    ] 
                     
                }catch (err) { 
                    echo "Snyk scan failed: ${err}" 
                    // Marcar build como inestable si hay vulnerabilidades 
                    currentBuild.result = 'UNSTABLE' 
                }

                sh 'snyk test --all-projects --json | snyk-to-sonar > snyk-sonar.json' 
                
                sh 'sonar-scanner -Dsonar.snyk.report.path=snyk-sonar.json' 

                sh 'snyk test --all-projects --severity-threshold=medium' 

                sh 'snyk code test --severity-threshold=high'
            }
        } */
 
        // Etapa 3: Pruebas Paralelizadas 
        stage('Pruebas en Paralelo') { 
            parallel { 
                // Pruebas en Chrome 
                stage('Pruebas Chrome') { 
                    steps { 
                        script { 
                            try { 
                                sh 'npm test -- --browser=chrome --watchAll=false --ci --reporters=jest-junit'
                                sh 'ls -R reports || echo "No reports folder found"'
                                junit 'reports/test/junit.xml'
                            } catch (err) { 
                                echo "Pruebas en Chrome fallaron: ${err}" 
                                currentBuild.result = 'UNSTABLE' 
                            } 
                        } 
                    } 
                } 
                // Pruebas en Firefox 
                stage('Pruebas Firefox') { 
                    steps { 
                        script { 
                            try { 
                                sh 'npm test -- --browser=firefox --watchAll=false --ci --reporters=jest-junit' 
                                junit 'reports/test/junit.xml' 
                            } catch (err) { 
                                echo "Pruebas en Firefox fallaron: ${err}" 
                                currentBuild.result = 'UNSTABLE' 
                            } 
                        } 
                    } 
                } 
            } 
        } 
 
        // Etapa 4: Deploy Simulado 
        stage('Deploy a Producción (Simulado)') { 
            steps { 
                script { 
                    // Crear carpeta "prod" y copiar build 
                    sh 'mkdir -p prod && cp -r build/* prod/' 
                    echo "¡Deploy simulado exitoso! Archivos copiados a /prod" 
                } 
            } 
        } 
    } 
    post { 
        always {
            
            script { 
                def qg = waitForQualityGate() 
                if (qg.status != 'OK') { 
                    error "Calidad no aprobada: ${qg.status}" 
                } 
            } 
            // Publicar reportes HTML (opcional) 
            publishHTML target: [ 
                allowMissing: true, 
                alwaysLinkToLastBuild: true, 
                keepAll: true, 
                reportDir: 'prod', 
                reportFiles: 'index.html', 
                reportName: 'Demo Deploy' 
            ] 
             
            // Notificación por email ante fallos 
            mail ( 
                subject: "Pipeline ${currentBuild.result}: ${env.JOB_NAME}", 
                body: """ 
                    <h2>Resultado: ${currentBuild.result}</h2> 
                    <p><b>URL del Build:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p> 
                    <p><b>Consola:</b> <a href="${env.BUILD_URL}console">Ver logs</a></p> 
                """, 
                to: 'jpcamposgarzon@gmail.com', 
                mimeType: 'text/html' 
            ) 
             
            // Limpiar workspace 
            cleanWs() 
        } 
    } 
}