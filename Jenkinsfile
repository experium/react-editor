scripts.discardOldJobBuilds('5')
scripts.killPreviousJobBuilds()

node {
    scripts.tryFinally {
        stage('Checkout') {
            checkout scm
        }

        errors = []
        def branch = env.BRANCH_NAME
        def isPR = branch ==~ /^PR-\d+$/
        def pwd = pwd()

        docker.image('node:9.8.0').inside('-e HOME=/tmp') {
            stage('Install deps and build packages') {
                withNPM(npmrcConfig:'npmrc') {
                    sh 'yarn install'
                    sh 'yarn package'
                }
            }

            if (!isPR) {
                stage('Publish package') {
                    withNPM(npmrcConfig:'npmrc') {
                        sh "npm run publish-npm"
                    }
                }
            }

            stage('Metrics') {
                sh 'yarn eslint'
                step([$class: 'CheckStylePublisher', pattern: 'reports/eslint.xml', usePreviousBuildReference: true])
            }

            stage('Build') {
                sh 'yarn build'
            }
        }

        if (!isPR) {
            stage('Publish artifacts') {
                step([$class: 'ArtifactArchiver', artifacts: 'dist/**/*', fingerprint: true])
            }

            stage('Deploy') {
                try {
                    sh "scp -r dist megazoll@web-dev:/var/www/player-builder.dev"
                } catch (err) {
                    currentBuild.result = 'UNSTABLE'
                    throw err
                }
            }
        }
    }
}
