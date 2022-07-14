
pipeline {
    agent any
    parameters {
        string(name: 'name_imagen', defaultValue: 'demo-angular-redux-with-ngrx', description: 'Nombre de la imagen')
        string(name: 'name_container', defaultValue: 'dev1-server-container', description: 'Nombre del docker')
        string(name: 'tag_imagen', defaultValue: 'latest', description: 'Etiqueta de la imagen')
        string(name: 'port_imagen', defaultValue: '8001', description: 'Puerto a publicar')
    }
    environment {
        name_final = "${name_container}${tag_imagen}${port_imagen}"
    }
    stages {
        stage('stop/rm') {
            when {
                expression {
                    DOCKER_EXIST = sh(returnStdout: true, script: 'echo "$(docker ps -q --filter name=${name_final})"').trim()
                    return  DOCKER_EXIST != ''
                }
            }
            steps {
                script {
                    sh '''
                         docker stop ${name_final}
                         docker rm -f ${name_final}
                    '''
                }
            }
        }

        stage('build') {
            steps {
                script {
                    sh '''
                    docker build -t ${name_imagen}:${tag_imagen}
                    '''
                }
            }
        }
        stage('run') {
            steps {
                script {
                    sh '''
                        docker run -dp ${port_imagen}:80 --name ${name_final} ${name_imagen}:${tag_imagen}

                    '''
                }
            }
        }
    }
}
