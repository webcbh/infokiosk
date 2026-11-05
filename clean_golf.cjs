const fs = require('fs');
let code = fs.readFileSync('src/components/GolfLayout.tsx', 'utf8');

const targetCourses = `          {(() => {
            const defaultCourses = [
              {
                id: 'course-1',
                title: 'Minthis Golf Club',
                subtitle: 'A stunning championship course set in a breathtaking natural landscape.',
                image: 'https://images.unsplash.com/photo-1593111663630-f47055745749?auto=format&fit=crop&w=800&q=80'
              },
              {
                id: 'course-2',
                title: 'Aphrodite Hills',
                subtitle: 'An award-winning golf resort with panoramic views and exceptional facilities.',
                image: 'https://images.unsplash.com/photo-1587314541740-f47055745749?auto=format&fit=crop&w=800&q=80'
              },
              {
                id: 'course-3',
                title: 'Secret Valley',
                subtitle: 'A unique golf experience surrounded by picturesque landscapes and serenity.',
                image: 'https://images.unsplash.com/photo-1535144883408-01186716093d?auto=format&fit=crop&w=800&q=80'
              },
              {
                id: 'course-4',
                title: 'Elea Golf',
                subtitle: 'A beautiful course that combines natural beauty with a memorable golfing experience.',
                image: 'https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=800&q=80'
              }
            ];
            
            const displayCourses = module.submodules || [];

            return displayCourses.map((sub: any, idx: number) => {`;

const replacementCourses = `          {(module.submodules || []).map((sub: any, idx: number) => {`;

code = code.replace(targetCourses, replacementCourses);

const targetEnd = `              </motion.div>
            );
          })})()}
        </div>`;
        
const replacementEnd = `              </motion.div>
            );
          })}
        </div>`;
code = code.replace(targetEnd, replacementEnd);
        
fs.writeFileSync('src/components/GolfLayout.tsx', code);
