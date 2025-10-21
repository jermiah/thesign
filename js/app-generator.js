/**
 * Application Generator
 * Handles code generation and project packaging
 */

class AppGenerator {
    constructor(blackboxAPI) {
        this.api = blackboxAPI;
        this.generatedFiles = [];
        this.isGenerating = false;
    }
    
    async generateFromRequirements(requirements) {
        this.isGenerating = true;
        this.generatedFiles = [];
        
        try {
            console.log('Generating application from requirements:', requirements);
            
            // Call Blackbox AI to generate the application
            const result = await this.api.generateApplication(requirements);
            
            if (result.success) {
                this.generatedFiles = result.files || [];
                
                return {
                    success: true,
                    files: this.generatedFiles,
                    message: 'Application generated successfully!'
                };
            } else {
                throw new Error(result.error || 'Generation failed');
            }
            
        } catch (error) {
            console.error('Generation error:', error);
            return {
                success: false,
                error: error.message
            };
        } finally {
            this.isGenerating = false;
        }
    }
    
    getFileByPath(path) {
        return this.generatedFiles.find(f => f.path === path);
    }
    
    getAllFiles() {
        return this.generatedFiles;
    }
    
    /**
     * Package files for download
     */
    async packageForDownload() {
        if (this.generatedFiles.length === 0) {
            throw new Error('No files to package');
        }
        
        // Create a simple text-based package
        let packageContent = '# Generated Application Package\n\n';
        packageContent += `Generated: ${new Date().toISOString()}\n\n`;
        packageContent += '---\n\n';
        
        this.generatedFiles.forEach(file => {
            packageContent += `## File: ${file.path}\n\n`;
            packageContent += '```\n';
            packageContent += file.content;
            packageContent += '\n```\n\n';
            packageContent += '---\n\n';
        });
        
        return packageContent;
    }
    
    /**
     * Download as ZIP (simplified version)
     */
    async downloadAsZip(projectName = 'my-app') {
        try {
            // For a real implementation, you would use JSZip library
            // For now, we'll download individual files
            
            for (const file of this.generatedFiles) {
                this.downloadFile(file.path, file.content);
                // Add small delay between downloads
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            return true;
        } catch (error) {
            console.error('Download error:', error);
            return false;
        }
    }
    
    /**
     * Download a single file
     */
    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    /**
     * Download all files as a single package
     */
    async downloadPackage(projectName = 'my-app') {
        const packageContent = await this.packageForDownload();
        this.downloadFile(`${projectName}-package.txt`, packageContent);
    }
    
    /**
     * Get project structure as tree
     */
    getProjectStructure() {
        const structure = {};
        
        this.generatedFiles.forEach(file => {
            const parts = file.path.split('/');
            let current = structure;
            
            parts.forEach((part, index) => {
                if (index === parts.length - 1) {
                    // File
                    current[part] = 'file';
                } else {
                    // Directory
                    if (!current[part]) {
                        current[part] = {};
                    }
                    current = current[part];
                }
            });
        });
        
        return structure;
    }
    
    /**
     * Get statistics about generated code
     */
    getStatistics() {
        const stats = {
            totalFiles: this.generatedFiles.length,
            totalLines: 0,
            totalCharacters: 0,
            fileTypes: {},
            largestFile: null,
            smallestFile: null
        };
        
        let maxSize = 0;
        let minSize = Infinity;
        
        this.generatedFiles.forEach(file => {
            const lines = file.content.split('\n').length;
            const chars = file.content.length;
            const ext = file.path.split('.').pop();
            
            stats.totalLines += lines;
            stats.totalCharacters += chars;
            
            if (!stats.fileTypes[ext]) {
                stats.fileTypes[ext] = 0;
            }
            stats.fileTypes[ext]++;
            
            if (chars > maxSize) {
                maxSize = chars;
                stats.largestFile = file.path;
            }
            
            if (chars < minSize) {
                minSize = chars;
                stats.smallestFile = file.path;
            }
        });
        
        return stats;
    }
    
    reset() {
        this.generatedFiles = [];
        this.isGenerating = false;
    }
}

// Export for use in main application
window.AppGenerator = AppGenerator;
