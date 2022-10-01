// Import modules
import React from 'react';
import styled from '@emotion/styled';

// Local modules
import {
  Flex,
  Typography,
  Modal,
  MarginContainer,
  Button
} from '@ui/index';
import { UsedCharacterCard } from './components/UsedCharacterCard';
import { UnusedCharacterCard } from './components/UnusedCharacterCard';
import {
  useAppDispatch,
  useAppSelector
} from '@hooks/state';

// Assets
import HelicopterBackground from '@images/helicopter-background.jpg';
import StripesBackground from '@images/select-character/stripes-background.png';
import AvatarSource from '@images/authentication/authentication-background-image.jpg';
import { selectCharacterSlice } from '@store/slices/SelectCharacterSlice';

// Styled Components
const HelicopterBackgroundLayer = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: url(${ HelicopterBackground });
  background-size: cover;
  background-repeat: no-repeat;
`;

const StripesBackgroundLayer = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: url(${ StripesBackground });
  background-size: cover;
  background-repeat: no-repeat;
  mix-blend-mode: screen;
`;

const ToneBackgroundLayer = styled.div`
  position: absolute;
  z-index: 3;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: radial-gradient(50% 50% at 50% 50%, rgba(17, 16, 27, 0.8526) 0%, rgba(17, 16, 27, 0.98) 100%);
`;

const SelectCharacterWrapper = styled(Flex)`
  position: relative;
  z-index: 4;
  height: 100%;
`;

const SelectCharacterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  column-gap: 30px;
  row-gap: 35px;
  
  max-width: 90%;
`;

const SelectCharacterTitle = styled(Typography)`
  width: fit-content;
  position: relative;
  white-space: nowrap;
  
  &::before{
    content: "ВЫБОР ПЕРСОНАЖА";
    position: absolute;
    left: calc(100% + 6px);
    
    white-space: nowrap;
    
    color: transparent;
    opacity: .5;
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: ${ ({ theme }) => theme.palette.gray };
  }
`;

const SocialClubUserLabel = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  align-items: center;
  column-gap: 29px;
  
  width: min-content;
  
  justify-self: flex-end;
  grid-column: 3 / 4;
  
  background-color: ${ ({ theme }) => theme.palette.bluegray };
  padding: 14px 14px 14px 36px;
  border-radius: 38px;
`;

const SocialClubUserAvatar = styled.div`
  position: relative;
  transform-style: preserve-3d;
  width: 50px;
  height: 50px;
  box-shadow: 0px 15px 59px -10px ${ ({ theme }) => theme.palette.red };
  border-radius: 100%;
  
  background-image: url(${ props => props.backgroundSrc });
  background-size: cover;
  
  grid-column: 2 / 3;
  grid-row: 1 / 3;
  
  &::before{
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;

    // Костыль, потому что родитель и псвевдоэлемент не могут одновременно иметь z-index
    // https://stackoverflow.com/questions/3032856/is-it-possible-to-set-the-stacking-order-of-pseudo-elements-below-their-parent-e
    transform: translate(-50%, -50%) translateZ(-1px); 
    width: 55px;
    height: 55px;
    background: linear-gradient(${ ({ theme }) => theme.palette.red }, ${ ({ theme }) => theme.palette.orange });
    border-radius: 100%;
  }
`;

const StyledModal = styled(Modal)`
  width: 500px;
`;

// Exports
export const SelectCharacter = () => {

  const dispatch = useAppDispatch();
  const { setModalVisibility } = selectCharacterSlice.actions;

  const isShown = useAppSelector(state => state.selectCharacter.isShown);
  const isModalShown = useAppSelector(state => state.selectCharacter.showModal);
  const characters = useAppSelector(state => state.selectCharacter.characters);

  const selectedCharacterIndex = useAppSelector(state => state.selectCharacter.selectedCharacterIndex);
  const selectedCharacterName = characters[selectedCharacterIndex]?.data.name;

  const closeModal = () => {
    dispatch(setModalVisibility({ modalVisibility: false }));
  };

  const chooseCharacter = () => {
    global.mp.trigger('client.choosePerson', selectedCharacterIndex);
  };


  return (
    <>
      {
        isShown && (
          <>
            <HelicopterBackgroundLayer/>
            <StripesBackgroundLayer/>
            <ToneBackgroundLayer/>
            <SelectCharacterWrapper
              alignItems='center'
              justifyContent='center'
            >
              <SelectCharacterGrid>
                <SelectCharacterTitle
                  variant='title'
                  color='white'
                >
                  ВЫБОР ПЕРСОНАЖА
                </SelectCharacterTitle>
                <SocialClubUserLabel>
                  <Typography
                    variant='small'
                    color='gray'
                  >
                    SocialClub
                  </Typography>
                  <Typography
                    // Social Club Nickname
                    variant='middle'
                    color='white'
                    bold
                  >
                    &#123; user &#125;
                  </Typography>
                  <SocialClubUserAvatar backgroundSrc={ AvatarSource }/>
                </SocialClubUserLabel>


                {
                  characters.length
                  ?
                    characters.map((character, index) => {
                      if (character.empty) {
                        return (
                          <UnusedCharacterCard
                            index={ index }
                            variant={ character.blocked ? 'locked' : undefined }
                          />
                        );
                      } else {
                        return (
                          <UsedCharacterCard
                            index={ index }
                            name={ character.data.name }
                            bank={ character.data.bank }
                            cash={ character.data.cash }
                            fraction={ character.data.fraction }
                            work={ character.data.work }
                            status={ character.data.status }
                          />
                        );
                      }
                    })
                  :
                    <Typography
                      variant='middle'
                      color='red'
                    >
                      Список персонажей пуст.
                    </Typography>
                }
              </SelectCharacterGrid>
            </SelectCharacterWrapper>
            <StyledModal
              title='ВХОД В ИГРУ'
              isModalShown={ isModalShown }
            >
              <MarginContainer bottom='30px'>
                <Typography
                  variant='small'
                  color='gray'
                  align='center'
                >
                  Вы уверены, что хотите войти в игру персонажем
                </Typography>
                <Typography
                  variant='small'
                  color='gray'
                  align='center'
                  bold
                >
                  { selectedCharacterName }
                </Typography>
              </MarginContainer>

              <Flex
                direction='column'
                alignItems='stretch'
                gap='20px'
              >
                <Button
                  variant='danger'
                  onClick={ () => chooseCharacter() }
                >
                  Войти в игру
                </Button>
                <Button
                  variant='default'
                  onClick={ () => closeModal() }
                >
                  Вернуться в меню
                </Button>
              </Flex>
            </StyledModal>
          </>
        )
      }
    </>
  );
};
