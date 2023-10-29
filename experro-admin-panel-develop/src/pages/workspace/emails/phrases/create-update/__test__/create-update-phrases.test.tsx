import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithClient } from '../../../../../../test';
import CreateUpdatePhrases from '../create-update-phrases';

const mockEditRecordId = jest.fn().mockReturnValue(null);
const mockIsCreateUpdatePhrasesModalVisible = jest.fn().mockReturnValue(null);
const mockShortCode = jest.fn().mockReturnValue(null);

const mockOnAddPhrase = jest.fn();
const mockOnNameChange = jest.fn();
const mockOnHideCreateUpdatePhraseModal = jest.fn();

describe('create update phrases', () => {
  describe('edit phrase dialog', () => {
    beforeEach(() => {
      mockEditRecordId.mockReturnValue('p1');
      mockShortCode.mockReturnValue('{{TestName}}');
      mockIsCreateUpdatePhrasesModalVisible.mockReturnValue(true);
    });

    it('render properly', () => {
      renderWithClient(
        //@ts-ignore
        <CreateUpdatePhrases
          editRecordId={mockEditRecordId()}
          isCreateUpdatePhrasesModalVisible={mockIsCreateUpdatePhrasesModalVisible()}
          // @ts-ignore
          shortCode={[1, 2, 3]}
          t={(name: string) => name}
          onHideCreateUpdatePhraseModal={mockOnHideCreateUpdatePhraseModal}
          onAddPhrase={mockOnAddPhrase}
          onNameChange={mockOnNameChange}
        />
      );

      const customDialog = screen.getByRole('dialog');
      expect(customDialog).toBeInTheDocument();
      const dialogTitle = screen.getByText('common.labels.edit_phrase');
      expect(dialogTitle).toBeInTheDocument();

      const nameLabel = screen.getByText('common.labels.name');
      expect(nameLabel).toBeInTheDocument();

      const nameTextbox = screen.getByPlaceholderText(
        'common.labels.enter_name'
      );
      expect(nameTextbox).toBeInTheDocument();

      const valueLabel = screen.getByText('common.labels.value');
      expect(valueLabel).toBeInTheDocument();

      const valueTextbox = screen.getByPlaceholderText(
        'common.labels.enter_value'
      );
      expect(valueTextbox).toBeInTheDocument();

      const shortCodeLabel = screen.getByText('common.labels.shortCode');
      expect(shortCodeLabel).toBeInTheDocument();

      // const shortCodeDisplay = screen.getByText('{{TestName}}');
      // expect(shortCodeDisplay).toBeInTheDocument();

      const copyButton = screen.getByLabelText('Copy');
      expect(copyButton).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', {
        name: 'common.labels.cancel',
      });
      expect(cancelButton).toBeInTheDocument();

      const saveButton = screen.getByRole('button', {
        name: 'common.labels.save',
      });
      expect(saveButton).toBeInTheDocument();
    });

    it('cancel button working properly', () => {
      renderWithClient(
        //@ts-ignore
        <CreateUpdatePhrases
          editRecordId={mockEditRecordId()}
          isCreateUpdatePhrasesModalVisible={mockIsCreateUpdatePhrasesModalVisible()}
          // @ts-ignore
          shortCode={[1, 2, 3]}
          t={(name: string) => name}
          onHideCreateUpdatePhraseModal={mockOnHideCreateUpdatePhraseModal}
          onAddPhrase={mockOnAddPhrase}
          onNameChange={mockOnNameChange}
        />
      );

      const cancelButton = screen.getByRole('button', {
        name: 'common.labels.cancel',
      });

      fireEvent.click(cancelButton);

      expect(mockOnHideCreateUpdatePhraseModal).toBeCalled();
    });

    it('save button working properly', () => {
      renderWithClient(
        //@ts-ignore
        <CreateUpdatePhrases
          editRecordId={mockEditRecordId()}
          isCreateUpdatePhrasesModalVisible={mockIsCreateUpdatePhrasesModalVisible()}
          // @ts-ignore
          shortCode={[1, 2, 3]}
          t={(name: string) => name}
          onHideCreateUpdatePhraseModal={mockOnHideCreateUpdatePhraseModal}
          onAddPhrase={mockOnAddPhrase}
          onNameChange={mockOnNameChange}
        />
      );

      const nameTextbox = screen.getByPlaceholderText(
        'common.labels.enter_name'
      );

      userEvent.type(nameTextbox, 'TestName');
      expect(mockOnNameChange).toBeCalled();

      const valueTextbox = screen.getByPlaceholderText(
        'common.labels.enter_value'
      );

      userEvent.type(valueTextbox, 'Testing');

      const saveButton = screen.getByRole('button', {
        name: 'common.labels.save',
      });

      fireEvent.click(saveButton);
      expect(mockOnAddPhrase).toBeCalled();
    });
  });

  describe('add phrase dialog', () => {
    beforeEach(() => {
      mockIsCreateUpdatePhrasesModalVisible.mockReturnValue(true);
    });

    it('render properly', () => {
      renderWithClient(
        //@ts-ignore
        <CreateUpdatePhrases
          isCreateUpdatePhrasesModalVisible={mockIsCreateUpdatePhrasesModalVisible()}
          // @ts-ignore
          shortCode={[1, 2, 3]}
          t={(name: string) => name}
          onHideCreateUpdatePhraseModal={mockOnHideCreateUpdatePhraseModal}
          onAddPhrase={mockOnAddPhrase}
          onNameChange={mockOnNameChange}
        />
      );

      const customDialog = screen.getByRole('dialog');
      expect(customDialog).toBeInTheDocument();

      const dialogTitle = screen.getByText('common.labels.add_phrase');
      expect(dialogTitle).toBeInTheDocument();

      const nameLabel = screen.getByText('common.labels.name');
      expect(nameLabel).toBeInTheDocument();

      const nameTextbox = screen.getByPlaceholderText(
        'common.labels.enter_name'
      );
      expect(nameTextbox).toBeInTheDocument();

      const valueLabel = screen.getByText('common.labels.value');
      expect(valueLabel).toBeInTheDocument();

      const valueTextbox = screen.getByPlaceholderText(
        'common.labels.enter_value'
      );
      expect(valueTextbox).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', {
        name: 'common.labels.cancel',
      });
      expect(cancelButton).toBeInTheDocument();

      const saveButton = screen.getByRole('button', {
        name: 'common.labels.save',
      });
      expect(saveButton).toBeInTheDocument();
    });

    it('cancel button working properly', () => {
      renderWithClient(
        //@ts-ignore
        <CreateUpdatePhrases
          isCreateUpdatePhrasesModalVisible={mockIsCreateUpdatePhrasesModalVisible()}
          // @ts-ignore
          shortCode={[1, 2, 3]}
          t={(name: string) => name}
          onHideCreateUpdatePhraseModal={mockOnHideCreateUpdatePhraseModal}
          onAddPhrase={mockOnAddPhrase}
          onNameChange={mockOnNameChange}
        />
      );

      const cancelButton = screen.getByRole('button', {
        name: 'common.labels.cancel',
      });

      fireEvent.click(cancelButton);

      expect(mockOnHideCreateUpdatePhraseModal).toBeCalled();
    });

    it('save button working properly', () => {
      renderWithClient(
        //@ts-ignore
        <CreateUpdatePhrases
          isCreateUpdatePhrasesModalVisible={mockIsCreateUpdatePhrasesModalVisible()}
          // @ts-ignore
          shortCode={[1, 2, 3]}
          t={(name: string) => name}
          onHideCreateUpdatePhraseModal={mockOnHideCreateUpdatePhraseModal}
          onAddPhrase={mockOnAddPhrase}
          onNameChange={mockOnNameChange}
        />
      );

      const nameTextbox = screen.getByPlaceholderText(
        'common.labels.enter_name'
      );

      userEvent.type(nameTextbox, 'TestName');
      expect(mockOnNameChange).toBeCalled();

      const valueTextbox = screen.getByPlaceholderText(
        'common.labels.enter_value'
      );

      userEvent.type(valueTextbox, 'Testing');

      const saveButton = screen.getByRole('button', {
        name: 'common.labels.save',
      });

      fireEvent.click(saveButton);
      expect(mockOnAddPhrase).toBeCalled();
    });
  });
});
