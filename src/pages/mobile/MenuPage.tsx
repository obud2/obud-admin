import { SMenuPage } from './MenuPage.styled';
import Navigation from '../../layout/Navigation';

const MenuPage = () => {
  return (
    <SMenuPage>
      {/* TODO: Type Navigation */}
      <Navigation open={false} handleDrawerToggle={() => null} />
    </SMenuPage>
  );
};

export default MenuPage;
